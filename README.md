# Flashcards TBS Verbal - Sinonim

Aplikasi **Flashcards TBS Verbal - Sinonim** adalah aplikasi berbasis Vue 3 dan Vuetify untuk membantu pengguna dalam mempelajari sinonim kata dalam bahasa Indonesia.

## 🚀 Fitur Utama

- Menampilkan kata beserta definisi dan contoh penggunaan.
- Navigasi antar kartu dengan tombol **Next** dan **Previous**.
- Data kata tersimpan dalam file `cards.json` untuk kemudahan pemeliharaan.

## 🛠️ Teknologi yang Digunakan

- [Vue 3](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)

## 📥 Instalasi & Menjalankan Aplikasi

1. **Clone repo ini**  
   ```sh
   git clone https://github.com/username/flashcards-tbs-verbal.git
   cd flashcards-tbs-verbal
   ```

2. **Instal dependensi**
    ```sh
    npm install
    ```
    
3. ***Jalankan server pengembangan***
    ```sh
    npm run dev
    ```

4. ***Buka aplikasi di browser***
Biasanya tersedia di http://localhost:5173/ (tergantung konfigurasi Vite).

## 📂 Struktur Data

Aplikasi ini menggunakan file `cards.json` sebagai sumber data utama untuk flashcards. Struktur data JSON yang digunakan adalah sebagai berikut:

```json
[
  {
    "word": "Hostes",
    "definition": "Pramugari atau pemandu wanita yang bertugas melayani tamu di suatu acara atau tempat.",
    "example": "Hostes di restoran itu menyambut tamu dengan ramah dan mengarahkan mereka ke meja yang telah disiapkan."
  },
  {
    "word": "Jenggala",
    "definition": "Hutan lebat atau wilayah yang masih liar dan belum terjamah.",
    "example": "Para peneliti menemukan spesies burung langka di tengah jenggala yang terpencil."
  }
]
```

