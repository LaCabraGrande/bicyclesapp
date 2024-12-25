import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 16px;
}

#root {
    width: 100%;
    height: 100%;
    display: contents;
}

:root {
    font-size: 18px;

    --text-color-light: black;
    --text-color-dark: white;
    --small-device: 640px;
    --medium-device: 968px;
    --large-device: 1860px;
}

/* Wireframe */

body {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

header {
    padding: 1rem;
    width: 100%;
    max-width: var(--large-device);
}

main {
    padding: 0.3rem 0.3rem 0.3rem 0.3rem;
    margin:0.5rem 0.5rem 0.5rem 0.5rem;
    width: 96%;
    max-width: var(--large-device);
    min-height: 78vh;
    border: 1px solid silver;
    border-radius: 0px;
    background-color: white;


    /* Tablet media query */
    @media (max-width: 768px) {
         min-height: 40vh; /* Reducer højden til tablet */
         padding: 10px;
    }

    /* Mobile media query */
    @media (max-width: 480px) {
        min-height: 18vh; /* Reducer højden yderligere til mobil */
        padding: 5px;
        margin: 0.1rem 0rem 0.5rem 0rem;
    }
}

footer {
    padding: 1rem;
    width: 100%;
    max-width: var(--large-device);
    display: flex;
    justify-content: space-evenly;
    color: white;
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 0.1rem;
}

h1 {
    font-size: 2rem;
    color: var(--text-color-light);
}

h2 {
    font-size: 1.5rem;
}

p {
    font-size: 1.2rem;
}
`;

export default GlobalStyle;
