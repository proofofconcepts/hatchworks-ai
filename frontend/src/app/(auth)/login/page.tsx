import LoginForm from '@/modules/auth/presentation/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  )
}
