const express = require('express') //express 모듈
const ejs = require('ejs')
const bodyParser = require('body-parser') //bodyparser모듈, get방식은 query에 정보 저장, post방식은 body에 정보 저장하기 때문에
const mysql = require('mysql2');
const app = express()
const port = 3000 //3000포트

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : ''
});
connection.connect();

app.set('view engine', 'ejs')
app.set('views', './views')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// 라우팅 localhost:3000/ 으로 들어왔을떄 응답을 해준다
app.get('/', (req, res) => { //localhost:3000/으로 접속하면,
    res.render('login', req.query) ///login.ejs 를 불러와서 출력해라, 렌더링 해준다.
})

app.post('/loginProcess', (req, res) => { //로그인 기능
    const user_id = req.body.UserId;
    const user_pw = req.body.UserPw;

    var sql = `SELECT * FROM accounts WHERE id=${user_id} and pw=${user_pw}`;

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        console.log(results.length);

        if(results.length){//success
            res.send("Welcome")
        }else{             //fail
            res.send("<script>alert('not found'); location.href='/'</script>")
        }
    });
})

app.get('/signup', (req, res) => {  // localhost:3000/signup 으로 들어왔을떄 응답해준다
    res.render('signup', req.query) // index.ejs를 불러와서 출력해라
})

app.post('/createProcess', (req, res) => { //회원가입 기능
    const id = req.body.newId;
    const password = req.body.newPw;       //회원가입 폼에서 id와 pw를 가져온다. post 방식이기 때문에 body-parser 모듈설치
    const name = req.body.newName;

    const sql = `INSERT INTO accounts(id,pw,name,created) 
                VALUES(${id}, ${password}, ${name},now());`;

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('insert is done');
        res.send("<script>alert('signed up'); location.href='/'</script>")
    });
})

app.listen(port, () => { //3000번포트로 들어오는것을 듣고 있다
    console.log(`Example app listening on port ${port}`)
})