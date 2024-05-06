const express = require('express') //express ���
const ejs = require('ejs')
const bodyParser = require('body-parser') //bodyparser���, get����� query�� ���� ����, post����� body�� ���� �����ϱ� ������
const mysql = require('mysql2');
const app = express()
const port = 3000 //3000��Ʈ

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


// ����� localhost:3000/ ���� �������� ������ ���ش�
app.get('/', (req, res) => { //localhost:3000/���� �����ϸ�,
    res.render('login', req.query) ///login.ejs �� �ҷ��ͼ� ����ض�, ������ ���ش�.
})

app.post('/loginProcess', (req, res) => { //�α��� ���
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

app.get('/signup', (req, res) => {  // localhost:3000/signup ���� �������� �������ش�
    res.render('signup', req.query) // index.ejs�� �ҷ��ͼ� ����ض�
})

app.post('/createProcess', (req, res) => { //ȸ������ ���
    const id = req.body.newId;
    const password = req.body.newPw;       //ȸ������ ������ id�� pw�� �����´�. post ����̱� ������ body-parser ��⼳ġ
    const name = req.body.newName;

    const sql = `INSERT INTO accounts(id,pw,name,created) 
                VALUES(${id}, ${password}, ${name},now());`;

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('insert is done');
        res.send("<script>alert('signed up'); location.href='/'</script>")
    });
})

app.listen(port, () => { //3000����Ʈ�� �����°��� ��� �ִ�
    console.log(`Example app listening on port ${port}`)
})