const API = "http://localhost:3000";


/* =========================
   USER
========================= */

let currentUser =
    JSON.parse(
        localStorage.getItem("tarigUser")
    );


/* =========================
   LOGIN PAGE
========================= */

function showRegister() {

    const login =
        document.getElementById("loginForm");

    const register =
        document.getElementById("registerForm");


    if (login) {

        login.style.display = "none";

    }


    if (register) {

        register.style.display = "block";

    }

}


function showLogin() {

    const login =
        document.getElementById("loginForm");

    const register =
        document.getElementById("registerForm");


    if (login) {

        login.style.display = "block";

    }


    if (register) {

        register.style.display = "none";

    }

}


/* =========================
   REGISTER
========================= */

async function registerUser() {

    const name =
        document.getElementById(
            "registerName"
        ).value.trim();


    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    if (!name || !email || !password) {

        message.textContent =
            "Please fill all fields.";

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/register`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        name,
                        email,
                        password

                    })

                }
            );


        const data =
            await response.json();


        message.textContent =
            data.message;


        if (response.ok) {

            setTimeout(
                function() {

                    showLogin();

                },
                1000
            );

        }

    } catch (error) {

        console.log(error);

        message.textContent =
            "Server connection error.";

    }

}


/* =========================
   LOGIN
========================= */

async function loginUser() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    if (!email || !password) {

        message.textContent =
            "Please enter email and password.";

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/login`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        email,
                        password

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            message.textContent =
                data.message;

            return;

        }


        localStorage.setItem(

            "tarigUser",

            JSON.stringify(data.user)

        );


        window.location.href =
            "/index.html";

    } catch (error) {

        console.log(error);

        message.textContent =
            "Server connection error.";

    }

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "tarigUser"
    );


    window.location.href =
        "/login.html";

}


/* =========================
   PROTECT HOME PAGE
========================= */

if (
    window.location.pathname.endsWith(
        "index.html"
    )
    ||
    window.location.pathname === "/"
) {

    if (!currentUser) {

        window.location.href =
            "/login.html";

    }

}


/* =========================
   SELECTED HOTEL
========================= */

let selectedHotel = null;


/* =========================
   LOAD HOTELS
========================= */

async function loadHotels() {

    const grid =
        document.getElementById(
            "hotelGrid"
        );


    if (!grid) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/hotels`
            );


        const hotels =
            await response.json();


        grid.innerHTML = "";


        hotels.forEach(

            function(hotel) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "hotel-card";


                card.innerHTML = `

                    <img
                        src="${hotel.image}"
                        alt="${hotel.name}"
                    >

                    <div class="hotel-info">

                        <h3>
                            ${hotel.name}
                        </h3>

                        <p>
                            📍 ${hotel.city}
                        </p>

                        <p>
                            ⭐ ${hotel.rating}
                        </p>

                        <div class="price">
                            SDG
                            ${Number(
                                hotel.price
                            ).toLocaleString()}
                            / night
                        </div>

                        <button
                            class="book-button"
                            onclick="openBooking(${hotel.id})"
                        >
                            Book Now
                        </button>

                    </div>

                `;


                grid.appendChild(card);

            }

        );

    } catch (error) {

        console.log(error);

        grid.innerHTML = `

            <p>
                Could not load hotels.
            </p>

        `;

    }

}


/* =========================
   OPEN BOOKING
========================= */

async function openBooking(hotelId) {

    try {

        const response =
            await fetch(
                `${API}/hotels`
            );


        const hotels =
            await response.json();


        selectedHotel =
            hotels.find(
                function(hotel) {

                    return hotel.id ==
                        hotelId;

                }
            );


        if (!selectedHotel) {

            alert(
                "Hotel not found."
            );

            return;

        }


        document.getElementById(
            "bookingHotel"
        ).value =
            selectedHotel.name;


        document.getElementById(
            "bookingName"
        ).value =
            currentUser.name;


        document.getElementById(
            "bookingEmail"
        ).value =
            currentUser.email;


        document.getElementById(
            "bookingPhone"
        ).value =
            "";


        document.getElementById(
            "bookingGuests"
        ).value =
            1;


        document.getElementById(
            "bookingNights"
        ).value =
            "";


        document.getElementById(
            "totalPrice"
        ).textContent =
            "SDG 0";


        document.getElementById(
            "bookingModal"
        ).style.display =
            "block";

    } catch (error) {

        console.log(error);

        alert(
            "Could not open booking."
        );

    }

}


/* =========================
   CLOSE MODAL
========================= */

function closeBooking() {

    document.getElementById(
        "bookingModal"
    ).style.display =
        "none";

}


/* =========================
   CALCULATE BOOKING
========================= */

function calculateBooking() {

    if (!selectedHotel) {

        return;

    }


    const checkIn =
        document.getElementById(
            "bookingCheckIn"
        ).value;


    const checkOut =
        document.getElementById(
            "bookingCheckOut"
        ).value;


    const nightsInput =
        document.getElementById(
            "bookingNights"
        );


    const totalElement =
        document.getElementById(
            "totalPrice"
        );


    if (!checkIn || !checkOut) {

        nightsInput.value = "";

        totalElement.textContent =
            "SDG 0";

        return;

    }


    const start =
        new Date(checkIn);


    const end =
        new Date(checkOut);


    const difference =
        end - start;


    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (nights <= 0) {

        nightsInput.value = "";

        totalElement.textContent =
            "SDG 0";

        return;

    }


    const total =
        nights *
        Number(selectedHotel.price);


    nightsInput.value =
        nights;


    totalElement.textContent =
        `SDG ${total.toLocaleString()}`;

}


/* =========================
   CONFIRM BOOKING
========================= */

async function confirmBooking() {

    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;

    }


    if (!selectedHotel) {

        alert(
            "Please select a hotel."
        );

        return;

    }


    const name =
        document.getElementById(
            "bookingName"
        ).value.trim();


    const email =
        document.getElementById(
            "bookingEmail"
        ).value.trim();


    const phone =
        document.getElementById(
            "bookingPhone"
        ).value.trim();


    const guests =
        Number(
            document.getElementById(
                "bookingGuests"
            ).value
        );


    const checkIn =
        document.getElementById(
            "bookingCheckIn"
        ).value;


    const checkOut =
        document.getElementById(
            "bookingCheckOut"
        ).value;


    const nights =
        Number(
            document.getElementById(
                "bookingNights"
            ).value
        );


    const total =
        nights *
        Number(selectedHotel.price);


    if (

        !name ||

        !email ||

        !guests ||

        !checkIn ||

        !checkOut ||

        nights <= 0

    ) {

        alert(
            "Please complete the booking information."
        );

        return;

    }


    const bookingData = {

        user_id:
            currentUser.id,

        hotel_id:
            selectedHotel.id,

        full_name:
            name,

        email:
            email,

        phone:
            phone,

        guests:
            guests,

        check_in:
            checkIn,

        check_out:
            checkOut,

        nights:
            nights,

        total_price:
            total

    };


    try {

        const response =
            await fetch(

                `${API}/bookings`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            bookingData
                        )

                }

            );


        const data =
            await response.json();


        if (!response.ok) {

            console.log(
                "SERVER RESPONSE:",
                data
            );


            alert(
                data.message ||
                "Could not create booking."
            );

            return;

        }


        alert(
            "Booking confirmed successfully! 🎉"
        );


        closeBooking();


        loadBookings();


    } catch (error) {

        console.log(error);

        alert(
            "Could not connect to server."
        );

    }

}


/* =========================
   LOAD BOOKINGS
========================= */

async function loadBookings() {

    const bookingList =
        document.getElementById(
            "bookingList"
        );


    if (!bookingList ||
        !currentUser) {

        return;

    }


    try {

        const response =
            await fetch(

                `${API}/bookings/${currentUser.id}`

            );


        const bookings =
            await response.json();


        bookingList.innerHTML = "";


        if (
            bookings.length === 0
        ) {

            bookingList.innerHTML = `

                <p class="no-bookings">

                    You have no bookings yet.

                </p>

            `;

            return;

        }


        bookings.forEach(

            function(booking) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "booking-card";


                const checkIn =
                    new Date(
                        booking.check_in
                    ).toLocaleDateString();


                const checkOut =
                    new Date(
                        booking.check_out
                    ).toLocaleDateString();


                card.innerHTML = `

                    <h3>
                        ${booking.hotel_name}
                    </h3>

                    <p>
                        📍 ${booking.city}
                    </p>

                    <p>
                        👤 ${booking.full_name}
                    </p>

                    <p>
                        👥 Guests:
                        ${booking.guests}
                    </p>

                    <p>
                        📅 Check-in:
                        ${checkIn}
                    </p>

                    <p>
                        📅 Check-out:
                        ${checkOut}
                    </p>

                    <p>
                        🌙 Nights:
                        ${booking.nights}
                    </p>

                    <p>
                        💰 Total:
                        SDG
                        ${Number(
                            booking.total_price
                        ).toLocaleString()}
                    </p>

                    <button
                        class="delete-button"
                        onclick="cancelBooking(${booking.id})"
                    >
                        Cancel Booking
                    </button>

                `;


                bookingList.appendChild(
                    card
                );

            }

        );

    } catch (error) {

        console.log(error);

        bookingList.innerHTML = `

            <p>
                Could not load bookings.
            </p>

        `;

    }

}


/* =========================
   CANCEL BOOKING
========================= */

async function cancelBooking(
    bookingId
) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(

                `${API}/bookings/${bookingId}`,

                {

                    method: "DELETE"

                }

            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;

        }


        alert(
            "Booking cancelled."
        );


        loadBookings();

    } catch (error) {

        console.log(error);

        alert(
            "Could not cancel booking."
        );

    }

}


/* =========================
   SEARCH
========================= */

function searchHotels() {

    const destination =
        document.getElementById(
            "destination"
        ).value
        .toLowerCase()
        .trim();


    const cards =
        document.querySelectorAll(
            ".hotel-card"
        );


    cards.forEach(

        function(card) {

            const text =
                card.textContent
                .toLowerCase();


            if (
                !destination ||
                text.includes(destination)
            ) {

                card.style.display =
                    "block";

            } else {

                card.style.display =
                    "none";

            }

        }

    );

}


/* =========================
   PAGE START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* Login/Register page */

        if (
            document.getElementById(
                "loginForm"
            )
        ) {

            return;

        }


        /* Home page */

        if (!currentUser) {

            return;

        }


        const userName =
            document.getElementById(
                "userName"
            );


        if (userName) {

            userName.textContent =
                currentUser.name;

        }


        loadHotels();

        loadBookings();


        /* Search */

        const searchButton =
            document.getElementById(
                "searchButton"
            );


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                searchHotels
            );

        }


        /* Booking dates */

        const checkIn =
            document.getElementById(
                "bookingCheckIn"
            );


        const checkOut =
            document.getElementById(
                "bookingCheckOut"
            );


        if (checkIn) {

            checkIn.addEventListener(
                "change",
                calculateBooking
            );

        }


        if (checkOut) {

            checkOut.addEventListener(
                "change",
                calculateBooking
            );

        }


        /* Confirm */

        const confirmButton =
            document.getElementById(
                "confirmBooking"
            );


        if (confirmButton) {

            confirmButton.addEventListener(
                "click",
                confirmBooking
            );

        }


        /* Cancel modal */

        const cancelButton =
            document.getElementById(
                "cancelBooking"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeBooking
            );

        }

    }
);