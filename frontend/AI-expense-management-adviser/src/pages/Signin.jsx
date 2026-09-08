const Signin = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] p-6 box-border">
      <div className="box-border w-full max-w-[400px] rounded-xl bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <h1 className="mb-2 text-center text-2xl font-bold text-[#172033]">Welcome back</h1>
        <p className="mb-6 text-center text-[#667085]">Sign in to manage your expenses</p>

        <form className="flex flex-col gap-2.5">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="email">Email</label>
          <input className="mb-2 rounded-md border border-[#d0d5dd] p-3 text-[15px]" id="email" type="email" placeholder="you@example.com" required />

          <label className="text-sm font-semibold text-[#344054]" htmlFor="password">Password</label>
          <input className="mb-2 rounded-md border border-[#d0d5dd] p-3 text-[15px]" id="password" type="password" placeholder="••••••••" required />

          <button className="mt-2 cursor-pointer rounded-md border-0 bg-blue-600 p-3 text-[15px] font-semibold text-white" type="submit">Sign in</button>
        </form>

        <p className="mt-6 text-center text-sm text-[#667085]">
          Don't have an account? <a href="/signup" className="font-semibold text-blue-600 no-underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default Signin