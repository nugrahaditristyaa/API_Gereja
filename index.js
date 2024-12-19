const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// const bodyParser = require("body-parser");
// const jsonParser = bodyParser.json();
// const bodyParser = require("body-parser");
// app.use(bodyParser.json()); // Ini sebenarnya redundant dengan express.json()

app.use(express.json());
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "repo.ukdw.ac.id",
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

app.post("/tambahDataJemaat", (req, res) => {
  const {
    no_induk_jemaat,
    pelayanan_diikuti,
    pelayanan_diminati,
    tgl_baptis_anak,
    tempat_baptis_anak,
    tanggal_baptis_dewasa,
    tempat_baptis_dewasa,
    tgl_sidhi,
    tampat_sidhi,
    tgl_nikah,
    tempat_nikah,
    tgl_masuk_gereja,
    asal_gereja,
    tgl_keluar_gereja,
    gereja_tujuan,
    alasan_keluar,
    tgl_meninggal,
    tempat_meninggal,
    tempat_pemakaman,
    penghasilan,
    transportasi,
    kondisi_fisik,
    deskripsi_disabilitas,
    penyakit_sering_diderita,
    alamat_rumah,
  } = req.body;

  const query = `
    INSERT INTO detail_jemaat (
      no_induk_jemaat,
      pelayanan_diikuti,
      pelayanan_diminati,
      tgl_baptis_anak,
      tempat_baptis_anak,
      tanggal_baptis_dewasa,
      tempat_baptis_dewasa,
      tgl_sidhi,
      tampat_sidhi,
      tgl_nikah,
      tempat_nikah,
      tgl_masuk_gereja,
      asal_gereja,
      tgl_keluar_gereja,
      gereja_tujuan,
      alasan_keluar,
      tgl_meninggal,
      tempat_meninggal,
      tempat_pemakaman,
      penghasilan,
      transportasi,
      kondisi_fisik,
      deskripsi_disabilitas,
      penyakit_sering_diderita,
      alamat_rumah
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    no_induk_jemaat,
    pelayanan_diikuti,
    pelayanan_diminati,
    tgl_baptis_anak,
    tempat_baptis_anak,
    tanggal_baptis_dewasa,
    tempat_baptis_dewasa,
    tgl_sidhi,
    tampat_sidhi,
    tgl_nikah,
    tempat_nikah,
    tgl_masuk_gereja,
    asal_gereja,
    tgl_keluar_gereja,
    gereja_tujuan,
    alasan_keluar,
    tgl_meninggal,
    tempat_meninggal,
    tempat_pemakaman,
    penghasilan,
    transportasi,
    kondisi_fisik,
    deskripsi_disabilitas,
    penyakit_sering_diderita,
    alamat_rumah,
  ];

  pool.getConnection((err, connect) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    connect.query(query, values, (err, results) => {
      connect.release(); // Selalu release koneksi setelah selesai

      if (err) {
        console.error("Error saat menambahkan data jemaat:", err);
        res.status(500).send("Gagal menambahkan data jemaat.");
        return;
      } else {
        res.status(201).json({
          message: "Data jemaat berhasil ditambahkan.",
          dataId: results.insertId,
        });
      }
    });
  });
});

app.post("/tambahDataPegawai", (req, res) => {
  const {
    nama,
    posisi,
    tanggal_masuk,
    tanggal_keluar,
    status_aktif,
    kode_user,
  } = req.body;

  // Validasi data jika diperlukan
  if (!nama || !posisi || !tanggal_masuk || !status_aktif || !kode_user) {
    return res
      .status(400)
      .json({ message: "Semua field wajib diisi, kecuali tanggal_keluar!" });
  }

  // Koneksi ke database dan eksekusi query
  pool.getConnection((err, connect) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      return res.status(500).json({ message: "Koneksi ke database gagal." });
    }

    const query = `
      INSERT INTO pegawai_dayu (
        nama, posisi, tanggal_masuk, tanggal_keluar, status_aktif, kode_user
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nama,
      posisi,
      tanggal_masuk,
      tanggal_keluar || null,
      status_aktif,
      kode_user,
    ];

    connect.query(query, values, (err, results) => {
      connect.release();

      if (err) {
        console.error("Error saat menambahkan data pegawai:", err);
        return res
          .status(500)
          .json({ message: "Gagal menambahkan data pegawai." });
      }

      return res.status(201).json({
        message: "Data pegawai berhasil ditambahkan.",
        dataId: results.insertId,
      });
    });
  });
});
app.post("/tambahDataMajelis", (req, res) => {
  const {
    nama,
    kode_wilayah,
    jabatan,
    periode_jabatan,
    tanggal_SK,
    tgl_penahbisan,
    status_aktif,
    kode_user,
  } = req.body;

  console.log("debug req json", req.body);
  // Validasi input
  if (
    !nama ||
    !kode_wilayah ||
    !jabatan ||
    !periode_jabatan ||
    !tanggal_SK ||
    !status_aktif ||
    !kode_user
  ) {
    return res.status(400).json({
      message: "Semua field wajib diisi!",
    });
  }

  pool.getConnection((err, connect) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      INSERT INTO majelis_jemaat (
        nama, kode_wilayah, jabatan, periode_jabatan, tanggal_SK,
        tgl_penahbisan, status_aktif, kode_user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nama,
      kode_wilayah,
      jabatan,
      periode_jabatan,
      tanggal_SK,
      tgl_penahbisan,
      status_aktif,
      kode_user,
    ];

    connect.query(query, values, (err, results) => {
      connect.release(); // Selalu release koneksi setelah selesai

      if (err) {
        console.error("Error saat menambahkan data majelis:", err);
        res.status(500).send("Gagal menambahkan data majelis.");
        return;
      } else {
        res.status(201).json({
          message: "Data majelis berhasil ditambahkan.",
          dataId: values,
        });
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

app.get("/jemaat/ulangTahun", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        no_urut,
        no_induk_jemaat,
        kode_wilayah,
        nama, 
        DATE_FORMAT(tgl_lahir, '%Y-%m-%d') as tanggal_lahir
      FROM jemaat
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
  });
});

app.get("/jemaat/detailPelayanan", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        j.no_urut,
        j.no_induk_jemaat,
        j.kode_wilayah,
        j.nama, 
        d.pelayanan_diikuti,
        j.telepon
      FROM 
        jemaat j
      JOIN
        detail_jemaat d ON j.no_induk_jemaat = d.no_induk_jemaat
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
  });
});

app.get("/jemaat/detailPekerjaan", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        no_urut,
        no_induk_jemaat,
        kode_wilayah,
        nama,
        pekerjaan,
        bidang,
        telepon
      FROM jemaat 
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
  });
});

app.get("/jemaat/detailGolonganDarah", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        no_urut,
        no_induk_jemaat,
        kode_wilayah,
        nama,
        golongan_darah,
        telepon
      FROM jemaat 
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
  });
});

app.get("/jemaat/detailGender", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        no_urut,
        no_induk_jemaat,
        kode_wilayah,
        nama,
        jenis_kelamin,
        telepon
      FROM jemaat 
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
  });
});

app.get("/jemaat/detailDisabilitas", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        j.no_urut,
        j.no_induk_jemaat,
        j.kode_wilayah,
        j.nama, 
        d.kondisi_fisik,
        d.deskripsi_disabilitas,
        j.telepon
      FROM 
        jemaat j
      JOIN
        detail_jemaat d ON j.no_induk_jemaat = d.no_induk_jemaat
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
  });
});

app.get("/jemaat/sebaranPelayanan", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT
      j.kode_wilayah,
      d.pelayanan_diikuti,
      COUNT(*) AS total_warga
    FROM
      jemaat j
    JOIN
      detail_jemaat d ON j.no_induk_jemaat = d.no_induk_jemaat
    GROUP BY
      j.kode_wilayah, d.pelayanan_diikuti
    ORDER BY
      total_warga DESC
    LIMIT 4
  `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      const transformedData = rows.reduce((acc, row) => {
        const wilayah = acc.find((w) => w.kode_wilayah === row.kode_wilayah);

        if (!wilayah) {
          acc.push({
            kode_wilayah: row.kode_wilayah,
            pelayanans: [
              {
                pelayanan_diikuti: row.pelayanan_diikuti,
                total_warga: row.total_warga,
              },
            ],
          });
        } else {
          wilayah.pelayanans.push({
            pelayanan_diikuti: row.pelayanan_diikuti,
            total_warga: row.total_warga,
          });
        }

        return acc;
      }, []);

      res.status(200).json({ data: rows });
    });
  });
});
app.get("/jemaat/sebaranDisabilitas", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        kondisi_fisik,
        COUNT(*) as jumlah
      FROM detail_jemaat
      WHERE kondisi_fisik IN ('Non Disabilitas', 'Disabilitas')
      GROUP BY kondisi_fisik 
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      const total = rows.reduce(
        (acc, row) => {
          if (row.kondisi_fisik === "Non Disabilitas") {
            acc.totalNonDisabilitas += row.jumlah;
          } else if (row.kondisi_fisik === "Disabilitas") {
            acc.totalDisabilitas += row.jumlah;
          }
          return acc;
        },
        { totalNonDisabilitas: 0, totalDisabilitas: 0 }
      );
      res.status(200).json({
        data: rows,
        totals: total,
      });
    });
  });
});
app.get("/jemaat/sebaranGrafikDisabilitas", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        j.kode_wilayah,
        d.kondisi_fisik,
        COUNT(*) AS total 
      FROM detail_jemaat d
      JOIN jemaat j ON d.no_induk_jemaat = j.no_induk_jemaat
      GROUP BY j.kode_wilayah, d.kondisi_fisik
      ORDER BY j.kode_wilayah, d.kondisi_fisik DESC
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }
      const data = rows.reduce((acc, row) => {
        const { kode_wilayah, kondisi_fisik, total } = row;
        if (!acc[kode_wilayah]) {
          acc[kode_wilayah] = { Disabilitas: 0, "Non Disabilitas": 0 };
        }
        acc[kode_wilayah][kondisi_fisik] = total;
        return acc;
      }, {});
      res.status(200).json({ data: rows });
    });
  });
});
app.get("/jemaat/sebaranGrafikGender", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        kode_wilayah,
        jenis_kelamin,
        COUNT(*) AS total 
      FROM jemaat 
      GROUP BY kode_wilayah, jenis_kelamin
      ORDER BY kode_wilayah, jenis_kelamin DESC
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }
      const data = rows.reduce((acc, row) => {
        const { kode_wilayah, jenis_kelamin, total } = row;
        if (!acc[kode_wilayah]) {
          acc[kode_wilayah] = { "Laki-laki": 0, "Perempuan": 0 };
        }
        acc[kode_wilayah][jenis_kelamin] = total;
        return acc;
      }, {});
      res.status(200).json({ data: rows });
    });
  });
});
app.get("/pelayanan", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT * FROM pelayanan 
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
  });
});
app.get("/pekerjaan", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT * FROM pekerjaan 
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }

      res.status(200).json({ data: rows });
    });
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
