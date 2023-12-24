const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

const translator = new Translator();

suite("Functional Tests", () => {
  test("Translation with text and locale fields: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .send({
        text: "Mangoes are my favorite fruit.",
        locale: "american-to-british",
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          text: "Mangoes are my favorite fruit.",
          translation: translator.translateAndHighlight(
            "Mangoes are my favorite fruit.",
            "american-to-british",
          ),
        });
        done();
      });
  });

  test("Translation with text and invalid locale field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .send({
        text: "Mangoes are my favorite fruit.",
        locale: "spanish-to-british",
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid value for locale field" });
        done();
      });
  });
  test("Translation with missing text field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .send({
        locale: "american-to-british",
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });
  test("Translation with missing locale field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .send({
        text: "Mangoes are my favorite fruit.",
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });
  test("Translation with text that needs no translation: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/translate")
      .send({
        text: "Mangoes are my favourite fruit.",
        locale: "american-to-british",
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          text: "Mangoes are my favourite fruit.",
          translation: "Everything looks good to me!",
        });
        done();
      });
  });
});
