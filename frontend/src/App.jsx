import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen";
import { Outlet } from "react-router-dom";


function App() {
  return (
    <>
      <Header></Header>
      <main className="py-3">
        <Container>
          <h1>Welcome to Rick's Shop</h1>
          <Outlet></Outlet>
        </Container>
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
