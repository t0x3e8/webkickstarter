# webkickstarter
The project was created to demonstrate the implementation of a web application developed in Node.js and, to act as a scaffold for new projects.


### TECH STACK:
- [Express.js](http://expressjs.com),
- [MongoDB](https://www.mongodb.com/) and [Mongoose](http://mongoosejs.com/),
- [Bootstrap](http://getbootstrap.com),
- [JQuery](https://jquery.com),
- [Pug](https://pugjs.org/api/getting-started.html),
- [Moment](http://momentjs.com/),
- [Underscore](http://underscorejs.org)

### DEV TECH:
- [Bower](https://bower.io/) - installed globally,
- [ESLint](http://eslint.org/),
- [Mocha](https://mochajs.org/),
- [Chai](http://chaijs.com/),
- [Sinon](http://sinonjs.org/) and [Sinon-mongoose](https://github.com/underscopeio/sinon-mongoose),
- [node-mocks-http](https://github.com/howardabrams/node-mocks-http),
- [Supertest](https://github.com/visionmedia/supertest),
- [Typings](https://github.com/typings/typings) - Intellisense for VS Code, installed globally,


### Getting started
1. run 'git clone https://github.com/t0x3e8/webkickstarter.git webkickstarter'
2. in a 'webkickstarter' folder run 'npm install',
3. run 'bower update' - if bower is not installed yet, visit this link https://bower.io/#install-bower for more guidance,
4. run 'startMongo.bat' scritp, if MongoDB is not installed yet, visit this link https://docs.mongodb.com/manual/installation/ for more guidance 
5. run 'npm start' to start the server,
6. run 'npm test' to run all tests, 


### Enabling ESLint in VS Code

In order to enable integration ESLint with Visual Studio Code, you need to install ESLint extension https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint. 
Each file which was modified will be automatically run agains ESLint.
ESLint is disable for unit tests, which probably it's not the base practice :)

### Architecture
The project's architecture is very simple and consists of 3 big elements. 
1. Database -  data are stored in MongoDB which is NoSQL database and can be easily access through schemas provided by Mongoose.
2. API - exposes CRUD operations on Database through RESTful API.
3. Server - represents the application. Server can access Database only through API, and direct connection should be avoided.

### Test-Driven Development (TDD)

The project's API is fully unit tested with use of Mocha test framework. The assertion library is Chai (expect). 
In order to avoid connection with the database, the model is mocked with the use of Sinon libraries.
Additionally to pass parameters of request the node-mock-http library is used.
Example of TDD:

```
        describe('Need to be able to CREATE a new post::', function () {
            it('should create a new post', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('create')
                    .once()
                    .chain('exec')
                    .yields(null, post2WithoutComments);
                req = httpMocks.createRequest({ body: { title: "Post 2", content: "Content of Post 2" } });

                postController.postCreate(req, res, null);

                resData = JSON.parse(res._getData());
                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(201);
                expect(resData.title).to.be.equal("Post 2");
                expect(resData.content).to.be.equal("Content of Post 2");
                expect(resData.date).to.be.equal('2016-12-30T23:33:54.217Z');
                expect(resData.comments.length).to.be.equal(0);
            }));

            it('should return an error when Title is missing', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('create')
                    .never()
                    .chain('exec')
                    .yields(null, null);
                req = httpMocks.createRequest({ body: { title: undefined, content: undefined } });

                postController.postCreate(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(400);
                expect(res._getData()).to.be.equal('{"error":"Missing request data (Title)"}');
            }));

            it('should return 500 and an error when an error occurs', sinon.test(function () {
                var PostMock = this.mock(Post);
                PostMock
                    .expects('create')
                    .once()
                    .chain('exec')
                    .yields("Error happened", null);
                req = httpMocks.createRequest({ body: { title: "Post 2", content: "Content of Post 2" } });

                postController.postCreate(req, res, null);

                expect(res).to.not.equal(null && {});
                expect(res.statusCode).to.be.equal(500);
                expect(res._getData()).to.be.equal('{"error":"Error happened"}');
            }));
        });
```
### Behavior-Driven Development (BDD)

The similar approach as for TDD is applied with testing of Server, where tests have more behavioral character.
Tests reflect requirements, and therefore they mostly cover success paths. For example there is no requirement how to handle the case of missing input data in order to add a new comment. It's likely that the application will not handle this properly. The idea is that requirements will increase as so the number of unit tests and a new functionality.
Additionally, tests of server take advantage of Supertest utility to mock requests to API.
Example of BDD:

```
    it('Need to open Post 1 and be able to leave a new comment', sinon.test(function(done) {
        var comment = { author: 'New Author', content : 'New comment'};
        var postRequestStub = this.stub(request, 'post')
            .withArgs("http://localhost:3000/api/posts/123412341234123412341234/comments", { json: comment})
            .yields(null, { statusCode: 201 }, post1);
        
        supertest(server)
            .post('/post/123412341234123412341234')
            .send(comment)
            .expect(201)
            .end(function (err, res) {
                expect(postRequestStub.calledOnce).to.be.true;
                done();
            });            
    }));
```


### Issues?
If you find something not correct please enter an issue, thanks!
