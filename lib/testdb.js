// lib/testdb.js
import { db } from './db.js'; // Mengimpor koneksi Tuan

async function testConnection() {
  console.log("Mencoba menghubungkan ke MySQL...");
  try {
    // 1. Ambil data dari tabel 'products' Tuan
    //    Saya lihat di screenshot Tuan, nama tabel Tuan adalah 'products'
    const [rows, fields] = await db.execute('SELECT * FROM products LIMIT 1');
    
    console.log("--------------------------");
    console.log("KONEKSI BERHASIL!");
    console.log("Berhasil mengambil 1 data:");
    console.log(rows); // Tampilkan 1 produk pertama
    console.log("--------------------------");

    // 2. Tutup koneksi
    await db.end();
    
  } catch (error) {
    console.log("--------------------------");
    console.log("KONEKSI GAGAL ATAU QUERY ERROR:");
    console.error(error.message);
    console.log("--------------------------");
  }
}

// Jalankan fungsi tes
testConnection();