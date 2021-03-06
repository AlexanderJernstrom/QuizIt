import axios from "axios";

export const words = [
  "frankrike",
  "brasilien",
  "spanien",
  "brad pitt",
  "portugal",
  "donald trump"
];
export const shuffle = array => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const generateWord = async name => {
  let request = await axios.get(
    `https://api.datamuse.com/words?ml=${name}&max=10`
  );
  let data = request.data;

  let randomItem = data[Math.floor(Math.random() * request.data.length)];
  return randomItem.word;
};

export const generateWordsAPI = async rightAnswer => {
  const translatedAnswer = await axios.get(
    `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T152203Z.b4490ae6b0dce9c7.8bff6aff5cd24374a261071ab769f7e12c0928b3&lang=en&text=${rightAnswer}`
  );
  let realAnswer = translatedAnswer.data.text;

  let alternative1 = await generateWord(realAnswer);
  let alternative2 = await generateWord(realAnswer);

  let translatedAlt1 = await axios.get(
    `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T152203Z.b4490ae6b0dce9c7.8bff6aff5cd24374a261071ab769f7e12c0928b3&lang=sv&text=${alternative1}`
  );
  let translatedAlt2 = await axios.get(
    `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T152203Z.b4490ae6b0dce9c7.8bff6aff5cd24374a261071ab769f7e12c0928b3&lang=sv&text=${alternative2}`
  );

  if (translatedAlt1.data.text[0] === rightAnswer) {
    console.log("Alt 1 is duplicate");
    alternative1 = await generateWord(realAnswer);
    translatedAlt1 = await axios.get(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T152203Z.b4490ae6b0dce9c7.8bff6aff5cd24374a261071ab769f7e12c0928b3&lang=sv&text=${alternative1}`
    );
  } else if (translatedAlt2.data.text[0] === rightAnswer) {
    console.log("Alternative 2 is a duplicate");
    alternative2 = await generateWord(realAnswer);
    translatedAlt2 = await axios.get(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T152203Z.b4490ae6b0dce9c7.8bff6aff5cd24374a261071ab769f7e12c0928b3&lang=sv&text=${alternative2}`
    );
  } else if (translatedAlt1.data.text[0] === translatedAlt2.data.text[0]) {
    console.log("Alt 2 is a duplicate");
    alternative2 = await generateWord(realAnswer);
    translatedAlt2 = await axios.get(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191125T152203Z.b4490ae6b0dce9c7.8bff6aff5cd24374a261071ab769f7e12c0928b3&lang=sv&text=${alternative2}`
    );
  }

  const alternatives = [
    translatedAlt1.data.text[0],
    translatedAlt2.data.text[0],
    rightAnswer
  ];
  return shuffle(alternatives);
};

export const countRightAnswers = resArray => {
  console.log(resArray)
  let rightAnswers = 0;
  resArray.forEach(res => {
    const key = Object.keys(res);
    if (res[key] === true) {
      rightAnswers++;
    }
  });
  return rightAnswers;
};
