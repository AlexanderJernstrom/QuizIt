/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import { Redirect } from "react-router";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const createQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [questionsError, setQuestionsError] = useState("");

  const validate = questionsArray => {
    let isValidated = false;
    questionsArray.map(question => {
      if (question.text.length > 0 && question.answer.length > 0) {
        isValidated = true;
      } else {
        isValidated = false;
      }
    });

    return isValidated;
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", answer: "" }]);
    console.log(questions);
  };

  const questionChanged = (e, index) => {
    let questionsCopy = [...questions];
    questionsCopy.splice(index, 1, {
      text: e.target.value,
      answer: questions[index].answer
    });
    setQuestions(questionsCopy);
  };

  const answerChanged = (e, index) => {
    let answersCopy = [...questions];
    answersCopy.splice(index, 1, {
      text: questions[index].text,
      answer: e.target.value,
      alternatives: questions[index].alternatives
    });
    setQuestions(answersCopy);
  };

  const sendQuiz = questionsArray => {
    const isValid = validate(questionsArray);
    if (isValid) {
      axios
        .post("https://grim-dungeon-58618.herokuapp.com/createQuiz", {
          name,
          questions,
          id: localStorage.getItem("id")
        }, {headers: {authToken: localStorage.getItem('token')}})
        .then(res => {
          setQuizId(res.data.quiz._id);
          setRedirect(true);
        });
    } else {
      setQuestionsError("Question and answer cannot be blank");
    }
  };

  const addAlternative = idx => {
    const questionsCopy = [...questions];
    questionsCopy[idx].alternatives = [{ text: "" }, { text: "" }];
    setQuestions(questionsCopy);
  };

  const alternativeOnChange = (e, indexAlt, indexQuestion) => {
    const questionsCopy = [...questions];
    questionsCopy[indexQuestion].alternatives[indexAlt] = {
      text: e.target.value
    };
    setQuestions(questionsCopy);
  };

  const deleteQuestion = individualQuestion => {
    let questionsCopy = [...questions];
    questions.forEach((question, index) => {
      if (question === individualQuestion) {
        questionsCopy.splice(index, 1);
      }
    });

    setQuestions(questionsCopy);
    setQuestionsError("");
  };

  const onNameChange = e => {
    setName(e.target.value);
  };
  return (
    <div className="Create-quiz">
      {redirect === true ? (
        <Redirect
          to={{ pathname: "createQuiz/result", state: { id: quizId } }}
        />
      ) : (
        <div />
      )}

      <TextField
        label="Name of your quiz"
        variant="outlined"
        id="outlined-basic"
        name="name"
        data-cy="name-form"
        onChange={e => onNameChange(e)}
      />
      <br />
      {questions.map((question, index) => {
        return (
          <div key={index} className="create-quiz-form elevation" >
            <div style={{width: "80%"}}>
            <TextField
              onChange={e => questionChanged(e, index)}
              label="Type your question"
              name="text"
              data-cy="question"
              style={{marginLeft: "30px"}}
              fullWidth
            />
            <TextField
              onChange={e => answerChanged(e, index)}
              label="Type your answer"
              name="answer"
              data-cy="answer"
              style={{marginLeft: "30px"}}
              fullWidth
            />
            </div>
            
            <Button onClick={() => deleteQuestion(question)}>
              <DeleteIcon />
            </Button>

            <Button
              onClick={() => addAlternative(index)}
              size="medium"
              variant="text"
              title="Add alternatives to this question"
              data-cy="add-alt"
            >
              <Icon color="primary">add_circle</Icon>
            </Button>

            {questionsError ? (
              <div style={{ color: "red", margin: "0" }}>
                <p>{questionsError}</p>
              </div>
            ) : null}
            <br />
            <div style={{ whiteSpace: "pre" }}>
              {question.alternatives
                ? question.alternatives.map((alt, idx) => {
                    return (
                      <div>
                        <TextField
                          onChange={e => alternativeOnChange(e, idx, index)}
                          placeholder="Add an alternative"
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        );
      })}
      <Button
        onClick={addQuestion}
        size="medium"
        variant="text"
        title="Add a new question"
        data-cy="add-question"
      >
        <Icon color="primary">add_circle</Icon>
      </Button>
      <br />
      <Button
        data-cy="create-quiz"
        color="primary"
        onClick={() => sendQuiz(questions)}
      >
        Create your quiz
      </Button>
    </div>
  );
};

export default createQuiz;
