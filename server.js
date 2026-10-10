const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 3000;


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname));


/* =========================
   MYSQL DATABASE
========================= */

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "tarig_db"

});


db.connect(function(error) {

    if (error) {

        console.log("Database connection failed:");
        console.log(error);

        return;
    }

    console.log("Database connected successfully");

});


/* =========================
   HOME PAGE
========================= */

app.get("/", function(req, res) {

    res.sendFile(
        path.join(__dirname, "login.html")
    );

});


/* =========================
   REGISTER
========================= */

app.post("/register", async function(req, res) {

    const {
        name,
        email,
        password
    } = req.body;


    if (!name || !email || !password) {

        return res.status(400).json({

            message: "Please fill all fields."

        });

    }


    try {

        db.query(

            "SELECT * FROM users WHERE email = ?",

            [email],

            async function(error, results) {

                if (error) {

                    console.log(error);

                    return res.status(500).json({

                        message: "Database error."

                    });

                }


                if (results.length > 0) {

                    return res.status(400).json({

                        message: "Email already exists."

                    });

                }


                const hashedPassword =
                    await bcrypt.hash(password, 10);


                db.query(

                    `INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)`,

                    [
                        name,
                        email,
                        hashedPassword
                    ],

                    function(error) {

                        if (error) {

                            console.log(error);

                            return res.status(500).json({

                                message:
                                    "Could not create account."

                            });

                        }


                        res.json({

                            message:
                                "Account created successfully."

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server error."

        });

    }

});


/* =========================
   LOGIN
========================= */

app.post("/login", function(req, res) {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({

            message:
                "Please enter email and password."

        });

    }


    db.query(

        "SELECT * FROM users WHERE email = ?",

        [email],

        async function(error, results) {

            if (error) {

                console.log(error);

                return res.status(500).json({

                    message: "Database error."

                });

            }


            if (results.length === 0) {

                return res.status(401).json({

                    message:
                        "Email or password is incorrect."

                });

            }


            const user = results[0];


            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    message:
                        "Email or password is incorrect."

                });

            }


            res.json({

                message: "Login successful.",

                user: {

                    id: user.id,

                    name: user.name,

                    email: user.email

                }

            });

        }

    );

});


/* =========================
   GET HOTELS
========================= */

app.get("/hotels", function(req, res) {

    db.query(

        "SELECT * FROM hotels",

        function(error, results) {

            if (error) {

                console.log(error);

                return res.status(500).json({

                    message: "Database error."

                });

            }


            res.json(results);

        }

    );

});


/* =========================
   CREATE BOOKING
========================= */

app.post("/bookings", function(req, res) {

    const {

        user_id,

        hotel_id,

        full_name,

        email,

        phone,

        guests,

        check_in,

        check_out,

        nights,

        total_price

    } = req.body;


    /* =========================
       CHECK BOOKING DATA
    ========================= */

    if (

        !user_id ||

        !hotel_id ||

        !full_name ||

        !email ||

        !guests ||

        !check_in ||

        !check_out ||

        !nights ||

        !total_price

    ) {

        return res.status(400).json({

            message:
                "Please fill all booking fields."

        });

    }


    /* =========================
       GET HOTEL NAME
    ========================= */

    db.query(

        "SELECT name FROM hotels WHERE id = ?",

        [hotel_id],

        function(error, results) {

            if (error) {

                console.log(
                    "Hotel search error:"
                );

                console.log(error);

                return res.status(500).json({

                    message:
                        "Could not find hotel."

                });

            }


            if (results.length === 0) {

                return res.status(404).json({

                    message:
                        "Hotel not found."

                });

            }


            const hotel_name =
                results[0].name;


            /* =========================
               SAVE BOOKING
            ========================= */

            db.query(

                `INSERT INTO bookings

                (
                    user_id,
                    hotel_id,
                    hotel_name,
                    full_name,
                    email,
                    phone,
                    guests,
                    check_in,
                    check_out,
                    nights,
                    total_price
                )

                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                [

                    user_id,

                    hotel_id,

                    hotel_name,

                    full_name,

                    email,

                    phone || "",

                    guests,

                    check_in,

                    check_out,

                    nights,

                    total_price

                ],

                function(error, result) {

                    if (error) {

                        console.log(
                            "BOOKING DATABASE ERROR:"
                        );

                        console.log(error);

                        return res.status(500).json({

                            message:
                                "Could not create booking.",

                            error:
                                error.sqlMessage

                        });

                    }


                    /* =========================
                       SUCCESS
                    ========================= */

                    res.json({

                        message:
                            "Booking confirmed.",

                        bookingId:
                            result.insertId

                    });

                }

            );

        }

    );

});


/* =========================
   GET USER BOOKINGS
========================= */

app.get(
    "/bookings/:userId",
    function(req, res) {

        const userId =
            req.params.userId;


        db.query(

            `SELECT

                bookings.*,

                hotels.name AS hotel_name,

                hotels.city

             FROM bookings

             JOIN hotels

             ON bookings.hotel_id = hotels.id

             WHERE bookings.user_id = ?

             ORDER BY bookings.id DESC`,

            [userId],

            function(error, results) {

                if (error) {

                    console.log(error);

                    return res.status(500).json({

                        message:
                            "Database error."

                    });

                }


                res.json(results);

            }

        );

    }

);


/* =========================
   DELETE BOOKING
========================= */

app.delete(

    "/bookings/:id",

    function(req, res) {

        const bookingId =
            req.params.id;


        db.query(

            "DELETE FROM bookings WHERE id = ?",

            [bookingId],

            function(error) {

                if (error) {

                    console.log(error);

                    return res.status(500).json({

                        message:
                            "Could not cancel booking."

                    });

                }


                res.json({

                    message:
                        "Booking cancelled."

                });

            }

        );

    }

);


/* =========================
   START SERVER
========================= */

app.listen(

    PORT,

    function() {

        console.log(
            `TARIG server running at http://localhost:${PORT}`
        );

    }

);