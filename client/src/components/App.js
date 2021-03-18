import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from "./pages/Landing";
import About from "./pages/About";
import Quote from "./quote/Quote";
import Header from "./Header";
import Chatbot from "./chatbot/Chatbot";
const App = () => {
    return <div>
        <BrowserRouter>
            <div className="container">
                <Header/>
                <Route exact path="/" component={Landing} />
                <Route exact path="/about" component={About} />
                <Route exact path="/quote" component={Quote} />
                <Chatbot/>
            </div>
        </BrowserRouter>
    </div>
}

export default App;