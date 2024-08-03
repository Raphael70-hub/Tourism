const express = require('express');
const mysql = require("mysql2/promise");
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const pool = mysql.createPool({
    host: "sql.freedb.tech",
    user: "freedb_admin7070",
    password: "C7uHTEQf3@s#eDm",
    database: "freedb_tourist_destinations",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get("/", async function(req, res) {
    var categories = [
        {name:"Historical Sites", img: "images/categories/historicalSites.jpeg"},
        {name:"Natural Attractions", img: "images/categories/naturalAttractions.jpeg"},
        {name:"Cultural Experiences", img: "images/categories/culturalExperiences.webp"},
        {name:"Adventure and Outdoor Activities", img: "images/categories/AOA.webp"},
        {name:"Accommodations", img: "images/categories/accommodations.jpeg"}
    ];

    try {
        const [result] = await pool.query('SELECT * FROM destinations LIMIT 3');
        res.render("index", {result: result, categories: categories});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/destinations", async function(req, res) {
    try {
        const [result] = await pool.query('SELECT * FROM destinations');
        res.render("destinations", {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/categoryDestination/:name", async function(req, res) {
    const name = req.params.name;
    try {
        const query = name !== "Accommodations" ? 
            `SELECT * FROM destinations WHERE category='${name}'` : 
            'SELECT * FROM accomodation';
        const [result] = await pool.query(query);
        const renderPage = name !== "Accommodations" ? "destinations" : "places_to_stay";
        res.render(renderPage, {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/stay", async function(req, res) {
    try {
        const [result] = await pool.query('SELECT * FROM accomodation');
        res.render("places_to_stay", {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/eat", async function(req, res) {
    try {
        const [result] = await pool.query('SELECT * FROM eateries');
        res.render("places_to_eat", {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/tripPlanning", function(req, res) {
    res.render("tripPlanning");
});

app.get("/transport", async function(req, res) {
    try {
        const [result] = await pool.query('SELECT * FROM transports');
        res.render("transportServices", {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/accomodationDetail/:id", async function(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query(`SELECT * FROM accomodation WHERE id=${id}`);
        res.render("detail", {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/destinationDetail/:id", async function(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query(`SELECT * FROM destinations WHERE id=${id}`);
        res.render("destinationDetail", {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/eatDetail/:id", async function(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query(`SELECT * FROM eateries WHERE id=${id}`);
        res.render("eatDetail", {result: result});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/destinationReviews/:id/:destination", async function(req, res) {
    const id = req.params.id;
    const destination = req.params.destination;
    try {
        const [result] = await pool.query(`SELECT * FROM destinationReviews WHERE desID=${id}`);
        res.render("destinationReviews", {result: result, desID: id, destination: destination});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.post("/postDestinationReview/:desID", async function(req, res) {
    const review = req.body.review;
    const star = parseInt(req.body.star);
    const desID = req.params.desID;

    try {
        const [result] = await pool.query(`SELECT * FROM destinationReviews WHERE desID=${desID}`);
        let totalStar = result.reduce((acc, review) => acc + review.star, 0);
        let averageStar = Math.floor(totalStar / result.length);

        await pool.query(`UPDATE destinations SET star=${averageStar} WHERE id=${desID}`);
        await pool.query("INSERT INTO destinationReviews (review, star, desID) VALUES (?, ?, ?)", [review, star, desID]);

        res.render("success");
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/stayReviews/:id/:place", async function(req, res) {
    const id = req.params.id;
    const place = req.params.place;
    try {
        const [result] = await pool.query(`SELECT * FROM stayReviews WHERE desID=${id}`);
        res.render("stayReviews", {result: result, desID: id, place: place});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.post("/postStayReview/:desID", async function(req, res) {
    const review = req.body.review;
    const star = parseInt(req.body.star);
    const desID = req.params.desID;

    try {
        const [result] = await pool.query(`SELECT * FROM stayReviews WHERE desID=${desID}`);
        let totalStar = result.reduce((acc, review) => acc + review.star, 0);
        let averageStar = Math.floor(totalStar / result.length);

        await pool.query(`UPDATE accomodation SET star=${averageStar} WHERE id=${desID}`);
        await pool.query("INSERT INTO stayReviews (review, star, desID) VALUES (?, ?, ?)", [review, star, desID]);

        res.render("success");
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.get("/eatReviews/:id/:place", async function(req, res) {
    const id = req.params.id;
    const place = req.params.place;
    try {
        const [result] = await pool.query(`SELECT * FROM eatReviews WHERE desID=${id}`);
        res.render("eatReviews", {result: result, desID: id, place: place});
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.post("/postEatReview/:desID", async function(req, res) {
    const review = req.body.review;
    const star = parseInt(req.body.star);
    const desID = req.params.desID;

    try {
        const [result] = await pool.query(`SELECT * FROM eatReviews WHERE desID=${desID}`);
        let totalStar = result.reduce((acc, review) => acc + review.star, 0);
        let averageStar = Math.floor(totalStar / result.length);

        await pool.query(`UPDATE eateries SET star=${averageStar} WHERE id=${desID}`);
        await pool.query("INSERT INTO eatReviews (review, star, desID) VALUES (?, ?, ?)", [review, star, desID]);

        res.render("success");
    } catch (err) {
        res.render("failure", {error: err});
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});
