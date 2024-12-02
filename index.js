const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "repo.ukdw.ac.id/p/",
  user: "71210677",
  password: "pXRyC@f-Su](46RR",
  database: "71210677",
});

app.get("/jemaat", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * from jemaat", (err, rows) => {
      connection.release();
      if (!err) {
        res.status(200).json({ data: rows });
      } else {
        res.status(500).json({ error: err });
      }
    });
  });
});

app.get("/jemaat/jumlah", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT COUNT(*) as jumlah_jemaat from jemaat",
      (err, rows) => {
        connection.release();
        if (!err) {
          res.status(200).json({ data: rows });
        } else {
          res.status(500).json({ error: err });
        }
      }
    );
  });
});

app.get("/jemaat/sebaranWilayah", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT kode_wilayah, COUNT(*) as jumlah from jemaat GROUP BY kode_wilayah",
      (err, rows) => {
        connection.release();
        if (!err) {
          res.status(200).json({ data: rows });
        } else {
          res.status(500).json({ error: err });
        }
      }
    );
  });
});

app.get("/majelis/jumlah", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT COUNT(*) as jumlah_majelis from majelis_jemaat",
      (err, rows) => {
        connection.release();
        if (!err) {
          res.status(200).json({ data: rows });
        } else {
          res.status(500).json({ error: err });
        }
      }
    );
  });
});

app.get("/pegawai/jumlah", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT COUNT(*) as jumlah_pegawai from pegawai_dayu",
      (err, rows) => {
        connection.release();
        if (!err) {
          res.status(200).json({ data: rows });
        } else {
          res.status(500).json({ error: err });
        }
      }
    );
  });
});

// app.get("/:id", (req, res) => {
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         connection.query("SELECT * from movies WHERE id = ?", [req.params.id], (err, rows) => {
//         connection.release(); // return the connection to pool
//         if (!err) {
//             res.status(200).json({ data: rows });
//         } else {
//             res.status(500).json({ error: err });
//         }
//         });
//     });
// });

// app.delete("/:id", (req, res) => {
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         connection.query("DELETE from movies WHERE id = ?", [req.params.id], (err, rows) => {
//         connection.release(); // return the connection to pool
//         if (!err) {
//             res.status(200).json({ data: rows });
//         } else {
//             res.status(500).json({ error: err });
//         }
//         });
//     });
// });

// app.post("/", jsonParser, (req, res) => {
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         const params = req.body;
//         connection.query("INSERT INTO movies SET ?", params, (err, rows) => {
//         connection.release(); // return the connection to pool
//         if (!err) {
//             res.status(200).json({ data: rows });
//         } else {
//             res.status(500).json({ error: err });
//         }
//         });
//     });
// });

// app.put("/:id", jsonParser, (req, res) => {
//     console.log(req);
//     const { id } = req.params;
//     const params = req.body;

//     pool.getConnection((err, connection) => {
//         if (err) throw err;

//         const fields = [];
//         const values = [];

//         for (const key in params){
//             fields.push(`${key} = ?`);
//             values.push(params[key])
//         }

//         const query = `UPDATE movies SET ${fields.join(", ")} WHERE id = ?`;
//         values.push(Number(id));

//         console.log(fields)
//         console.log(values)

//         connection.query(query, values, (err, rows) => {
//         connection.release(); // return the connection to pool
//         if (!err) {
//             res.status(200).json({ data: rows });
//         } else {
//             res.status(500).json({ error: err });
//         }
//         });
//     });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
