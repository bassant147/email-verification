const router = require("express").Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Token = require("../models/Token")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

const { User, validateSignup } = require("../models/User");

// signup
router.post("/signup", async (req, res) => {
	try {
		const { error } = validateSignup(req.body);
		if (error)
			return res.status(400).json({ status: 'fail', message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.json({ status: 'fail', message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();
		
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`
        await sendEmail(user.email, "Verify Email", url)

        res.status(201).json({ status: 'success', message: "An email was sent to your account please verify" });
	} catch (error) {
        console.log(error)
		res.status(500).json({ status: 'fail', message: "Internal Server Error" });
	}
});

// signin
router.post("/signin", async (req, res) => {
	try {
		const { error } = validateSignin(req.body);
		if (error)
			return res.status(400).json({ status: 'fail', message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).json({ status: 'fail', message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).json({ status: 'fail', message: "Invalid Email or Password" });

		const token = user.generateAuthToken();
		res.status(200).json({ status: 'success', data: token, message: "logged in successfully" });
	} catch (error) {
        console.log(error)
		res.status(500).json({ status: 'fail', message: "Internal Server Error" });
	}
});

const validateSignin = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
}

router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        if(!user) return res.status(400).send({ message: "Invalid Link"})

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });

        if(!token) return res.status(400).send({message: "Invalid Link"})

        await User.updateOne({_id: user._id, verified: true})
        await token.remove()

        res.status(200).send({ message: "Email verified successfully"})
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error"})
    }
}) 

module.exports = router;