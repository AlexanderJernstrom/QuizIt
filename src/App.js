import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import QuizDashBoard from "./quizDashBoard";
import Quiz from "./Quiz";
import MainPage from "./MainPage";
import createQuiz from "./createQuiz";
import Result from "./Result";
import Navbar from "./Navbar";
import Scores from "./Scores";
import MultipleAnswer from "./MultipleAnswer";
import Mode from "./Mode";
import CreateUser from "./CreateUser";
import QuizResults from "./QuizResults";
import Login from "./Login";
import User from "./User";
import { FlashCards } from "./FlashCards";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <div>
            <Navbar />
            <Route
              exact
              path="/quizDashBoard/write/:id/result"
              component={QuizResults}
            />
            <Route exact path="/quizDashBoard/scores/:id" component={Scores} />
            <Route exact path="/" component={MainPage} />
            <Route exact path="/quizDashBoard" component={QuizDashBoard} />
            <Route exact path="/quizDashBoard/mode/:id" component={Mode} />
            <Route
              exact
              path="/quizDashBoard/multipleAnswer/:id"
              component={MultipleAnswer}
            />
            <Route 
              exact
              path="/quizDashBoard/flashCards/:id"
              component={FlashCards}
            />
            <Route exact path="/user" component={User} />
            <Route exact path="/createUser" component={CreateUser} />
            <Route exact path="/createUser/login" component={Login} />
            <Route exact path="/quizDashBoard/write/:id" component={Quiz} />
            <Route exact path="/createQuiz" component={createQuiz} />
            <Route exact path="/createQuiz/result" component={Result} />
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
