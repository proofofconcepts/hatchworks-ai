import RegisterForm from '@/modules/auth/presentation/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Create account</h1>
        <RegisterForm />
      </div>
    </main>
  )
}
