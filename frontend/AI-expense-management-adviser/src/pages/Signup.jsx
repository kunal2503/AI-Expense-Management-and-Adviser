import { useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import {useNavigate} from "react-router";
import toast from "react-hot-toast";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleInputChanges = (e) => {
    setUserData({
      ...userData,
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      const response = await axiosInstance.post("/auth/signup",userData);
      if(response.status === 201){
        navigate("/dashboard");
        localStorage.setItem("token", response.data.token);
        toast.success("Signup successful!");
      }
    } catch(error){
      console.log("Error while signing up: ", error);
      toast.error("Error while signing up");
    }
  }
  

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4 py-8 font-sans text-[#182230]">
      <section className="w-full max-w-[420px] rounded-2xl border border-[#e7ebf0] bg-white p-10 shadow-[0_12px_35px_rgba(31,45,61,0.08)]">
        <div className="mb-7 text-xl font-bold text-blue-600">Pennywise</div>
        <h1 className="m-0 text-[28px] font-bold leading-tight">Create your account</h1>
        <p className="my-[10px] mb-7 text-[15px] text-[#667085]">Start managing your expenses with confidence.</p>

        <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Full name
            <input className="box-border w-full rounded-lg border border-[#d8dee8] px-3.5 py-3 text-sm text-[#182230] outline-none" type="text" name="username" placeholder="Alex Morgan" onChange={handleInputChanges} value={userData.username}/>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Email address
            <input className="box-border w-full rounded-lg border border-[#d8dee8] px-3.5 py-3 text-sm text-[#182230] outline-none" type="email" name="email" placeholder="alex@example.com" onChange={handleInputChanges} value={userData.email}/>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Password
            <input className="box-border w-full rounded-lg border border-[#d8dee8] px-3.5 py-3 text-sm text-[#182230] outline-none" type="password" name="password" placeholder="Create a password" onChange={handleInputChanges} value={userData.password} />
          </label>
          <button className="mt-1.5 cursor-pointer rounded-lg border-0 bg-blue-600 p-[13px] text-[15px] font-semibold text-white" type="submit">Create account</button>
        </form>

        <p className="my-0 mt-6 text-center text-sm text-[#667085]">
          Already have an account? <a className="font-semibold text-blue-600 no-underline" href="/login">Log in</a>
        </p>
      </section>
    </main>
  )
}

export default Signup