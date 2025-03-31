<template>
  <v-app id="app">
    <v-container class="d-flex flex-column align-center justify-center fill-height">
      <!-- Papan Skor -->
      <v-card class="pa-4 mb-4 text-center" max-width="400" elevation="3">
        <v-row justify="space-around">
          <v-col cols="6">
            <v-chip color="success">Benar: {{ correctCount }}</v-chip>
          </v-col>
          <v-col cols="6">
            <v-chip color="error">Salah: {{ errorCount }}</v-chip>
          </v-col>
        </v-row>
      </v-card>

      <v-card class="pa-6" max-width="400" elevation="5">
        <!-- Cegah error dengan v-if -->
        <template v-if="cards.length">
          <!-- Cards Left Indicator -->
          <v-chip class="float-right" color="secondary">
            Kata : {{ cards.length - usedIndexes.size }}
          </v-chip>

          <!-- Card Title - Show Word if "Show Answer" is clicked -->
          <v-card-title class="mt-12 text-h5 text-center">
            {{ showAnswer ? cards[currentIndex]?.word : "_".repeat(cards[currentIndex]?.word.length || 8) }}
          </v-card-title>

          <v-card-text>
            <p><strong>Definisi:</strong> {{ cards[currentIndex]?.definition || "Memuat..." }}</p>
            <p class="mt-2 font-italic">"{{ hiddenExample }}"</p>

            <!-- Opsi Pilihan Teks -->
            <div class="mt-4">
              <p><strong>List opsi : </strong></p>
              <div v-for="(option, index) in options" :key="index" class="option-text" >
                <li>{{ option }}</li>
              </div>
            </div>

            <p class="mt-10 "><strong>Ketik jawaban di input berikut </strong></p>
            <!-- Input field for guessing -->
            <v-text-field
              v-model="userGuess"
              label="Tebak Kata"
              outlined
              class="mt-4"
              @keyup.enter="checkAnswer"
            ></v-text-field>

          </v-card-text>
        </template>

        <!-- Loading Indicator -->
        <template v-else>
          <v-card-title class="text-h5 text-center">Memuat Data...</v-card-title>
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </template>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";

export default {
  data() {
    return {
      currentIndex: 0,
      cards: [],
      usedIndexes: new Set(),
      userGuess: "",
      showAnswer: false,
      correctCount: 0,
      errorCount: 0,
      options: [], // Untuk menampung pilihan jawaban
    };
  },
  computed: {
    hiddenExample() {
      if (!this.cards.length) return "";
      const word = this.cards[this.currentIndex]?.word || "";
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      return this.cards[this.currentIndex]?.example?.replace(regex, "_".repeat(word.length)) || "";
    },
  },
  methods: {
    async fetchCards() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}cards.json`);
        this.cards = await response.json();
        this.shuffleCards();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat mengambil data kartu.",
        });
      }
    },
    shuffleCards() {
      this.cards = this.cards.sort(() => Math.random() - 0.5);
      this.usedIndexes.clear();
      this.currentIndex = 0;
      this.correctCount = 0;
      this.errorCount = 0;
      this.generateOptions();
    },
    generateOptions() {
      // Ambil kata yang benar dan acak 4 kata lainnya untuk membuat pilihan
      const correctWord = this.cards[this.currentIndex]?.word;
      const otherWords = this.cards.filter((card, index) => index !== this.currentIndex)
        .map(card => card.word);
      
      // Acak 4 kata lainnya
      const shuffledWords = this.shuffleArray(otherWords).slice(0, 4);
      this.options = [correctWord, ...shuffledWords].sort(() => Math.random() - 0.5);
    },
    shuffleArray(arr) {
      return arr.sort(() => Math.random() - 0.5);
    },
    checkOption(option) {
      if (option.toLowerCase() === this.cards[this.currentIndex]?.word.toLowerCase()) {
        this.correctCount++;
        Swal.fire({
          icon: "success",
          title: "Benar!",
          text: "Great job! Jawaban Anda benar.",
        }).then(() => {
          this.nextCard();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Salah!",
          text: "Jawaban yang benar : " + this.cards[this.currentIndex]?.word,
        }).then(() => {
          this.errorCount++;
          this.nextCard();
        });
      }
    },
    nextCard() {
      if (this.cards.length === 0) return;
      if (!this.showAnswer && !this.userGuess.trim()) {
        this.errorCount++;
      }

      if (this.usedIndexes.size >= this.cards.length) {
        this.shuffleCards();
      }

      do {
        this.currentIndex = Math.floor(Math.random() * this.cards.length);
      } while (this.usedIndexes.has(this.currentIndex));

      this.usedIndexes.add(this.currentIndex);
      this.resetGuess();
    },
    prevCard() {
      if (this.cards.length === 0) return;

      do {
        this.currentIndex = Math.floor(Math.random() * this.cards.length);
      } while (this.usedIndexes.has(this.currentIndex));

      this.usedIndexes.add(this.currentIndex);
      this.resetGuess();
    },
    checkAnswer() {
      if (this.userGuess.trim().toLowerCase() === this.cards[this.currentIndex]?.word.toLowerCase()) {
        this.correctCount++;
        Swal.fire({
          icon: "success",
          title: "Benar!",
          text: "Great job! Jawaban Anda benar.",
        }).then(() => {
          this.nextCard();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Salah!",
          text: "Jawaban yang benar : " + this.cards[this.currentIndex]?.word,
        }).then(() => {
          this.errorCount++;
          this.nextCard();
        });
      }
    },
    revealAnswer() {
      this.showAnswer = true;
    },
    resetGuess() {
      this.userGuess = "";
      this.showAnswer = false;
      this.generateOptions(); // Generate options again for the next card
    },
  },
  mounted() {
    this.fetchCards();
  },
};
</script>

<style>
body {
  background-color: #f5f5f5;
}
.v-container {
  min-height: 100vh;
}
.float-right {
  position: absolute;
  top: 10px;
  right: 15px;
}
.option-text {
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  margin: 5px 0;
}
.option-text:hover {
  background-color: #f0f0f0;
  border-radius: 5px;
}
</style>
