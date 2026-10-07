@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@400;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  /* Tiefschwarzer Hintergrund mit einem echten Casino-Bild darüber */
  background-color: #050505;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
}

/* Dein kleines Menü oben links etwas aufhübschen */
nav, header, div.flex {
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #d4af37;
  padding: 10px;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 20px;
}

.gold-title {
  font-family: 'Cinzel', serif;
  font-size: 4rem;
  background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 20px;
  text-shadow: 0px 4px 20px rgba(212, 175, 55, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  color: #e0e0e0;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
}

.button-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-gold {
  background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%);
  color: #000;
  padding: 15px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.btn-gold:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
}

.btn-outline {
  background: rgba(0, 0, 0, 0.5);
  color: #d4af37;
  padding: 15px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: uppercase;
  border: 2px solid #d4af37;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.btn-outline:hover {
  background: #d4af37;
  color: #000;
  transform: translateY(-3px);
    }

