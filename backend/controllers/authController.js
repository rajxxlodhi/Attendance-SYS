import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// Register Employee
export const registerEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = await Employee.create({
      name,
      email,
      password: hashedPassword,
    });

    let token = await jwt.sign({newEmployee: newEmployee._id},process.env.JWT_SECRET,{expiresIn:"7d"})

      res.cookie("token",token ,{
            httpOnly:true,
            secure:process.env.NODE_ENVIREMONT = "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Employee
export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

      res.cookie("token",token ,{
            httpOnly:true,
            secure:process.env.NODE_ENVIREMONT = "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const LoguotEmployee = async (req ,res) =>{

  try {
    res.clearcookie('token',{
      httpOnly:true,
      secure:true,
      sameSite:"none"
  })
  return  res.status(200).json({message:"Logout successfully"})
  } catch (error) {
    return res.status(404).json({message:`errror in logout controler ${error}`})
  }
}
