<template>
  <v-app id="app">
    <v-container class="d-flex flex-column align-center justify-center fill-height">
      <v-card class="pa-6" max-width="400" elevation="5">
      <v-card-title class="text-h5 text-center" v-if="cards.length">{{ cards[currentIndex].word }}</v-card-title>
      <v-card-text v-if="cards.length">
        <p><strong>Definisi:</strong> {{ cards[currentIndex].definition }}</p>
        <p class="mt-2 font-italic">"{{ cards[currentIndex].example }}"</p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn @click="prevCard" color="primary" variant="elevated">Previous</v-btn>
        <v-btn @click="nextCard" color="primary" variant="elevated">Next</v-btn>
      </v-card-actions>
    </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      cards: []
    };
  },
  methods: {
    async fetchCards() {
      try {
        const response = await fetch('/cards.json');
        this.cards = await response.json();
        console.log(response);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      }
    },
    nextCard() {
      if (this.cards.length) {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      }
    },
    prevCard() {
      if (this.cards.length) {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
      }
    }
  },
  mounted() {
    this.fetchCards();
  }
};
</script>

<style>
body {
  background-color: #f5f5f5;
}
.v-container {
  min-height: 100vh;
}
</style>
