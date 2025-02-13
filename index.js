const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// function setCorsHeaders(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // Mengizinkan semua origin
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//   ); // Tambahkan OPTIONS
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // "application/json" tidak perlu ditulis

//   // Tangani preflight request dari browser
//   if (req.method === "OPTIONS") {
//     return res.status(204).end(); // 204 No Content untuk response OPTIONS
//   }

//   next();
// }

// app.use(setCorsHeaders);

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

app.put("/updateMajelis/:id_majelis", (req, res) => {
  const { id_majelis } = req.params;
  const {
    nama,
    kode_wilayah,
    jabatan,
    periode_jabatan,
    tanggal_SK,
    tgl_penahbisan,
    status_aktif,
  } = req.body;

  if (!nama || !jabatan || !periode_jabatan || !kode_wilayah) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  const query = `
    UPDATE majelis_jemaat 
    SET nama = ?, kode_wilayah = ?, jabatan = ?, periode_jabatan = ?, 
        tanggal_SK = ?, tgl_penahbisan = ?, status_aktif = ?
    WHERE id_majelis = ?
  `;

  const values = [
    nama,
    kode_wilayah,
    jabatan,
    periode_jabatan,
    tanggal_SK,
    tgl_penahbisan,
    status_aktif,
    id_majelis,
  ];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error("Error updating majelis:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Majelis berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Majelis tidak ditemukan." });
    }
  });
});

app.put("/updateJemaat/:no_urut", (req, res) => {
  const { no_urut } = req.params;
  const {
    no_kk,
    kode_wilayah,
    nama,
    tempat_lahir,
    tgl_lahir,
    jenis_kelamin,
    hubungan_keluarga,
    status_nikah,
    golongan_darah,
    hobby,
    telepon,
    email,
    pekerjaan,
    bidang,
    kerja_sampingan,
    alamat_kantor,
    pendidikan,
    jurusan,
    alamat_sekolah,
    status_jemaat,
    keaktifan_jemaat,
    tgl_tidak_aktif,
    alasan_tidak_aktif,
  } = req.body;

  if (
    !no_kk ||
    !kode_wilayah ||
    !nama ||
    !tempat_lahir ||
    !tgl_lahir ||
    !jenis_kelamin ||
    !hubungan_keluarga ||
    !status_nikah ||
    !golongan_darah ||
    !hobby ||
    !telepon ||
    !email ||
    !pekerjaan ||
    !bidang ||
    !kerja_sampingan ||
    !alamat_kantor ||
    !pendidikan ||
    !jurusan ||
    !alamat_sekolah ||
    !status_jemaat ||
    !keaktifan_jemaat
  ) {
    return res.status(400).json({ message: "Data wajib tidak boleh kosong!" });
  }

  const query = `
  UPDATE jemaat 
  SET 
    no_kk = ?, 
    kode_wilayah = ?, 
    nama = ?, 
    tempat_lahir = ?, 
    tgl_lahir = ?, 
    jenis_kelamin = ?, 
    hubungan_keluarga = ?, 
    status_nikah = ?, 
    golongan_darah = ?, 
    hobby = ?, 
    telepon = ?, 
    email = ?, 
    pekerjaan = ?, 
    bidang = ?, 
    kerja_sampingan = ?, 
    alamat_kantor = ?, 
    pendidikan = ?, 
    jurusan = ?, 
    alamat_sekolah = ?, 
    status_jemaat = ?, 
    keaktifan_jemaat = ?, 
    tgl_tidak_aktif = ?, 
    alasan_tidak_aktif = ?
  WHERE no_urut = ?;
`;

  const values = [
    no_kk,
    kode_wilayah,
    nama,
    tempat_lahir,
    tgl_lahir,
    jenis_kelamin,
    hubungan_keluarga,
    status_nikah,
    golongan_darah,
    hobby,
    telepon,
    email,
    pekerjaan,
    bidang,
    kerja_sampingan,
    alamat_kantor,
    pendidikan,
    jurusan,
    alamat_sekolah,
    status_jemaat,
    keaktifan_jemaat,
    tgl_tidak_aktif,
    alasan_tidak_aktif,
    no_urut,
  ];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error("Error updating jemaat:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Jemaat berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Jemaat tidak ditemukan." });
    }
  });
});

app.put("/updatePegawai/:id", (req, res) => {
  const { id } = req.params;
  const { nama, posisi, tanggal_masuk, tanggal_keluar, status_aktif } =
    req.body;

  // Validasi input (pastikan tidak ada field kosong)
  if (!nama || !posisi || !tanggal_masuk || !tanggal_keluar || !status_aktif) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  // Konversi ID menjadi integer untuk mencegah SQL injection
  const pegawaiId = parseInt(id, 10);
  if (isNaN(pegawaiId)) {
    return res.status(400).json({ message: "ID pegawai tidak valid!" });
  }

  // Pastikan status_aktif adalah string
  const statusAktifStr = String(status_aktif).trim(); // Pastikan string tidak ada spasi tambahan

  // Perbaiki query SQL
  const query = `
    UPDATE pegawai_dayu 
    SET nama = ?, posisi = ?, tanggal_masuk = ?, tanggal_keluar = ?, status_aktif = ? 
    WHERE id = ?
  `;

  const values = [
    nama,
    posisi,
    tanggal_masuk,
    tanggal_keluar,
    statusAktifStr,
    id,
  ];

  console.log("Query:", query);
  console.log("Values:", values);

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error("Error updating pegawai:", error.sqlMessage);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Pegawai berhasil diperbarui!" });
    } else {
      res.status(404).json({ message: "Pegawai tidak ditemukan." });
    }
  });
});

app.delete("/deleteMajelis/:id_majelis", (req, res) => {
  const { id_majelis } = req.params;
  const query = "DELETE FROM majelis_jemaat WHERE id_majelis = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      return res.status(500).json({ message: "Gagal menghubungi database" });
    }

    connection.query(query, [id_majelis], (err, result) => {
      connection.release(); // Melepaskan koneksi kembali ke pool

      if (err) {
        console.error("Gagal menghapus data majelis", err);
        return res.status(500).json({ message: "Gagal menghapus data" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({ message: "Data majelis berhasil dihapus" });
    });
  });
});

app.delete("/deletePegawai/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM pegawai_dayu WHERE id = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      return res.status(500).json({ message: "Gagal menghubungi database" });
    }

    connection.query(query, [id], (err, result) => {
      connection.release(); // Melepaskan koneksi kembali ke pool

      if (err) {
        console.error("Gagal menghapus data pegawai", err);
        return res.status(500).json({ message: "Gagal menghapus data" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({ message: "Data pegawai berhasil dihapus" });
    });
  });
});

// app.delete("/deletePegawai/:id", (req, res) => {
//   const { id } = req.params;
//   const query = "DELETE FROM pegawai_dayu WHERE id = ?";

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting connection from pool:", err);
//       return res.status(500).json({ message: "Gagal menghubungi database" });
//     }

//     connection.query(query, [id], (err, result) => {
//       connection.release(); // Melepaskan koneksi kembali ke pool

//       if (err) {
//         console.error("Gagal menghapus data pegawai:", err);
//         return res.status(500).json({ message: "Gagal menghapus data" });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "Data tidak ditemukan" });
//       }

//       res.json({ message: "Data pegawai berhasil dihapus" });
//     });
//   });
// });

app.delete("/jemaat/:no_urut", (req, res) => {
  const { no_urut } = req.params;
  const query = "DELETE FROM jemaat WHERE no_urut = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      return res.status(500).json({ message: "Gagal menghubungi database" });
    }

    connection.query(query, [no_urut], (err, result) => {
      connection.release(); // Melepaskan koneksi kembali ke pool

      if (err) {
        console.error("Gagal menghapus data jemaat:", err);
        return res.status(500).json({ message: "Gagal menghapus data" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({ message: "Data jemaat berhasil dihapus" });
    });
  });
});

app.post("/tambahDataJemaat", (req, res) => {
  const {
    no_kk,
    kode_wilayah,
    nama,
    tempat_lahir,
    tgl_lahir,
    jenis_kelamin,
    hubungan_keluarga,
    status_nikah,
    golongan_darah,
    hobby,
    telepon,
    email,
    pekerjaan,
    bidang,
    kerja_sampingan,
    alamat_kantor,
    pendidikan,
    jurusan,
    alamat_sekolah,
    status_jemaat,
    keaktifan_jemaat,
    tgl_tidak_aktif,
    alasan_tidak_aktif,
  } = req.body;

  const query = `
    INSERT INTO jemaat (
    no_kk,
    kode_wilayah,
    nama,
    tempat_lahir,
    tgl_lahir,
    jenis_kelamin,
    hubungan_keluarga,
    status_nikah,
    golongan_darah,
    hobby,
    telepon,
    email,
    pekerjaan,
    bidang,
    kerja_sampingan,
    alamat_kantor,
    pendidikan,
    jurusan,
    alamat_sekolah,
    status_jemaat,
    keaktifan_jemaat,
    tgl_tidak_aktif,
    alasan_tidak_aktif
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    no_kk,
    kode_wilayah,
    nama,
    tempat_lahir,
    tgl_lahir,
    jenis_kelamin,
    hubungan_keluarga,
    status_nikah,
    golongan_darah,
    hobby,
    telepon,
    email,
    pekerjaan,
    bidang,
    kerja_sampingan,
    alamat_kantor,
    pendidikan,
    jurusan,
    alamat_sekolah,
    status_jemaat,
    keaktifan_jemaat,
    tgl_tidak_aktif,
    alasan_tidak_aktif,
  ];

  console.log("req body jemaat", values);
  pool.getConnection((err, connect) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    connect.query(query, values, (error, results) => {
      connect.release(); // Selalu release koneksi setelah selesai

      if (error) {
        console.error("Error saat menambahkan data jemaat karena:", error);
        console.log("Error saat menambahkan data jemaat karena:", error);
        res.status(500).json({
          message: `post gagal menambahkan data jemaat,${req.body}`,
        });
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

app.get("/majelis", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * from majelis_jemaat", (err, rows) => {
      connection.release();
      if (!err) {
        res.status(200).json({ data: rows });
      } else {
        res.status(500).json({ error: err });
      }
    });
  });
});

app.get("/pegawai", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * from pegawai_dayu", (err, rows) => {
      connection.release();
      if (!err) {
        res.status(200).json({ data: rows });
      } else {
        res.status(500).json({ error: err });
      }
    });
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

app.get("/majelis/:id_majelis", (req, res) => {
  const { id_majelis } = req.params;

  const query = "SELECT * FROM majelis_jemaat WHERE id_majelis = ?";

  pool.query(query, [id_majelis], (err, results) => {
    if (err) {
      console.error("Gagal mengambil data majelis:", err);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Data majelis tidak ditemukan." });
    }

    res.status(200).json({ message: "Data ditemukan::", data: results[0] });
  });
});

app.get("/jemaat/:no_urut", (req, res) => {
  const { no_urut } = req.params;

  const query = "SELECT * FROM jemaat WHERE no_urut = ?";

  pool.query(query, [no_urut], (err, results) => {
    if (err) {
      console.error("Gagal mengambil data jemaat:", err);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Data jemaat tidak ditemukan." });
    }

    res.status(200).json({ message: "Data ditemukan", data: results[0] });
  });
});

app.get("/pegawai_dayu/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM pegawai_dayu WHERE id = ?";

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Gagal mengambil data pegawai:", err);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Data pegawai tidak ditemukan." });
    }

    res.status(200).json({ message: "Data ditemukan", data: results[0] });
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
app.get("/jemaat/sebaranGrafikPekerjaan", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        kode_wilayah,
        pekerjaan,
        COUNT(*) AS total 
      FROM jemaat 
      GROUP BY kode_wilayah, pekerjaan
      ORDER BY kode_wilayah, pekerjaan ASC
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

app.get("/jemaat/sebaranGrafikPelayanan", (req, res) => {
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
        COUNT(*) AS total 
      FROM detail_jemaat d 
      JOIN jemaat j ON d.no_induk_jemaat = j.no_induk_jemaat
      GROUP BY kode_wilayah, pelayanan_diikuti
      ORDER BY kode_wilayah, pelayanan_diikuti ASC
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
      ORDER BY kode_wilayah, jenis_kelamin ASC
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
          acc[kode_wilayah] = { "Laki-laki": 0, Perempuan: 0 };
        }
        acc[kode_wilayah][jenis_kelamin] = total;
        return acc;
      }, {});
      res.status(200).json({ data: rows });
    });
  });
});

app.get("/jemaat/sebaranGrafikGolonganDarah", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error saat koneksi ke database:", err);
      res.status(500).send("Koneksi database gagal.");
      return;
    }

    const query = `
      SELECT 
        kode_wilayah,
        golongan_darah,
        COUNT(*) AS total 
      FROM jemaat 
      GROUP BY kode_wilayah, golongan_darah
      ORDER BY kode_wilayah, golongan_darah DESC
    `;

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error saat mengambil data jemaat:", err);
        res.status(500).send("Gagal mengambil data jemaat.");
        return;
      }
      const data = rows.reduce((acc, row) => {
        const { kode_wilayah, golongan_darah, total } = row;
        if (!acc[kode_wilayah]) {
          acc[kode_wilayah] = { A: 0, B: 0, O: 0, AB: 0 };
        }
        acc[kode_wilayah][golongan_darah] = total;
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
