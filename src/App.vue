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
            <v-chip color="error">Skip: {{ skipCount }}</v-chip>
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

            <!-- Input field for guessing -->
            <v-text-field
              v-model="userGuess"
              label="Tebak Kata"
              outlined
              class="mt-4"
              @keyup.enter="checkAnswer"
            ></v-text-field>

            <!-- Show Answer Button -->
            <v-btn @click="revealAnswer" color="warning" variant="elevated" class="mt-2">Tampilkan Jawaban</v-btn>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn @click="prevCard" color="primary" variant="elevated">Sebelumnya</v-btn>
            <v-btn @click="skipCard" color="error" variant="elevated">Skip</v-btn>
          </v-card-actions>
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
      skipCount: 0,
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
        const response = await fetch("/cards.json");
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
      this.skipCount = 0;
    },
    nextCard() {
      if (this.cards.length === 0) return;
      if (!this.showAnswer && !this.userGuess.trim()) {
        this.skipCount++;
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
          title: "Coba lagi!",
          text: "Oops! Itu bukan jawaban yang benar.",
        });
      }
    },
    skipCard() {
      this.skipCount++;
      this.nextCard();
    },
    revealAnswer() {
      this.showAnswer = true;
    },
    resetGuess() {
      this.userGuess = "";
      this.showAnswer = false;
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
</style>
