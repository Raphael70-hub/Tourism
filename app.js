require("dotenv").config();
const express = require('express');
const mysql = require("mysql2");
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var conn = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_admin7070",
    password: "C7uHTEQf3@s#eDm",
    database: "freedb_tourist_destinations"
  });
  
  conn.connect(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Connected");
    }
  })


app.get("/", function(req,res){
    var categories = [
        {name:"Historical Sites", img: "images/categories/historicalSites.jpeg"},
        {name:"Natural Attractions", img: "images/categories/naturalAttractions.jpeg"},
        {name:"Cultural Experiences", img: "images/categories/culturalExperiences.webp"},
        {name:"Adventure and Outdoor Activities", img: "images/categories/AOA.webp"},
        {name:"Accommodations", img: "images/categories/accommodations.jpeg"}
    ]
    conn.query('SELECT * FROM destinations LIMIT 3', function(err,result){
        if(err){
            res.render("failure", {error: err})
        }
        else{
            res.render("index", {result: result, categories: categories})
        }
    })
});

app.get("/destinations",  function(req,res){
conn.query('SELECT * FROM destinations', function(err,result){
    if(err){
        res.render("failure", {error: err})
    }
    else{
        res.render("destinations", {result: result})
    }
})
});

app.get("/categoryDestination/:name",  function(req,res){
  const name = req.params.name
  if(name != "Accommodations"){
    conn.query(`SELECT * FROM destinations WHERE category='${name}'`, function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("destinations", {result: result})
      }
  })
  }
  else{
    conn.query('SELECT * FROM accomodation', function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("places_to_stay", {result: result})
      }
  })
  }
  });

app.get("/stay",  function(req,res){
  conn.query('SELECT * FROM accomodation', function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("places_to_stay", {result: result})
      }
  })
  });

app.get("/eat",  function(req,res){
  conn.query('SELECT * FROM eateries', function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("places_to_eat", {result: result})
      }
  })
});

app.get("/tripPlanning",  function(req,res){
  res.render("tripPlanning")  
});

app.get("/transport",  function(req,res){
  conn.query('SELECT * FROM transports', function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("transportServices", {result: result})
      }
  })
});

app.get("/accomodationDetail/:id",  function(req,res){
  const id = req.params.id
  conn.query(`SELECT * FROM accomodation WHERE id=${id}`, function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("detail", {result: result})
      }
  })
});


app.get("/destinationDetail/:id",  function(req,res){
  const id = req.params.id
  conn.query(`SELECT * FROM destinations WHERE id=${id}`, function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("destinationDetail", {result: result})
      }
  })
});


app.get("/eatDetail/:id",  function(req,res){
  const id = req.params.id
  conn.query(`SELECT * FROM eateries WHERE id=${id}`, function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("eatDetail", {result: result})
      }
  })
});


app.get("/destinationReviews/:id/:destination",  function(req,res){
  const id = req.params.id
  const destination = req.params.destination
  conn.query(`SELECT * FROM destinationReviews WHERE desID=${id}`, function(err,result){
      if(err){
          res.render("failure", {error: err})
      }
      else{
          res.render("destinationReviews", {result: result, desID: id, destination: destination})
      }
  })
});

app.post("/postDestinationReview/:desID",  function(req,res){
  const review = req.body.review
  const star = parseInt(req.body.star)
  const desID = req.params.desID

    conn.query(`SELECT * FROM destinationReviews WHERE desID=${desID}`, function(err,result){
        if(err){
            res.render("failure", {error: err})
        }
        else{
            var totalStar = 0
            for(i=0; i<result.length; i++){
                totalStar += result[i].star
            }
            var averageStar = Math.floor(totalStar / result.length)
            conn.query("UPDATE destinations SET star="+averageStar+" WHERE id="+desID+"", function(err,result){
                if(err){
                    res.render("failure", {error: err})
                }
                else{
                    conn.query("INSERT INTO destinationReviews (review,star,desID) VALUES ('"+ review +"', '"+ star +"', '"+ desID +"')", function(err,result){
                        if(err){
                            res.render("failure", {error: err})
                        }
                        else{
                            res.render("success")
                        }
                    })
                }
            })
        }
    })

});

app.get("/stayReviews/:id/:place",  function(req,res){
    const id = req.params.id
    const place = req.params.place
    conn.query(`SELECT * FROM stayReviews WHERE desID=${id}`, function(err,result){
        if(err){
            res.render("failure", {error: err})
        }
        else{
            res.render("stayReviews", {result: result, desID: id, place: place})
        }
    })
  });

app.post("/postStayReview/:desID",  function(req,res){
    const review = req.body.review
    const star = parseInt(req.body.star)
    const desID = req.params.desID

    conn.query(`SELECT * FROM stayReviews WHERE desID=${desID}`, function(err,result){
        if(err){
            res.render("failure", {error: err})
        }
        else{
            var totalStar = 0
            for(i=0; i<result.length; i++){
                totalStar += result[i].star
            }
            var averageStar = Math.floor(totalStar / result.length)
            conn.query("UPDATE accomodation SET star="+averageStar+" WHERE id="+desID+"", function(err,result){
                if(err){
                    res.render("failure", {error: err})
                }
                else{
                    conn.query("INSERT INTO stayReviews (review,star,desID) VALUES ('"+ review +"', '"+ star +"', '"+ desID +"')", function(err,result){
                        if(err){
                            res.render("failure", {error: err})
                        }
                        else{
                            res.render("success")
                        }
                    })
                }
            })
        }
    })
  
});



app.get("/eatReviews/:id/:place",  function(req,res){
    const id = req.params.id
    const place = req.params.place
    conn.query(`SELECT * FROM eatReviews WHERE desID=${id}`, function(err,result){
        if(err){
            res.render("failure", {error: err})
        }
        else{
            res.render("eatReviews", {result: result, desID: id, place: place})
        }
    })
  });

app.post("/postEatReview/:desID",  function(req,res){
    const review = req.body.review
    const star = parseInt(req.body.star)
    const desID = req.params.desID
  
    conn.query(`SELECT * FROM eatReviews WHERE desID=${desID}`, function(err,result){
        if(err){
            res.render("failure", {error: err})
        }
        else{
            var totalStar = 0
            for(i=0; i<result.length; i++){
                totalStar += result[i].star
            }
            var averageStar = Math.floor(totalStar / result.length)
            conn.query("UPDATE eateries SET star="+averageStar+" WHERE id="+desID+"", function(err,result){
                if(err){
                    res.render("failure", {error: err})
                }
                else{
                    conn.query("INSERT INTO eatReviews (review,star,desID) VALUES ('"+ review +"', '"+ star +"', '"+ desID +"')", function(err,result){
                        if(err){
                            res.render("failure", {error: err})
                        }
                        else{
                            res.render("success")
                        }
                    })
                }
            })
        }
    })
});
  

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
})
