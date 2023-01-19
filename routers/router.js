const {Router} = require("express")
const {check} = require("express-validator");
const router = Router()

const UserController = require('../controllers/UserController')

router.post("/registration",
    check("email", "Пошта не є коректною").isEmail(),
    check("name", "Не вказано ім'я користувача").exists(),
    check("lastName", "Ви не ввели свою фамілію").exists(),
    check("surName", "Всі поля мають бути заповнені!").exists(),
    check("password", "Пароль має містити від 4 до 12 символів!").exists().isLength({min: 4, max: 12}),
    UserController.registration
    )
router.post("/login",
    check("email", "Ви ввели некоректну пошту").isEmail(),
    check("password", "Всі поля мають бути заповнені").exists(),
    UserController.login
    )
router.post("/checkTokens", UserController.checkTokens)
router.get("/refresh", UserController.refresh)
router.post("/logout", UserController.logout)


module.exports = router;