import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UserProfileForm } from '@/components/user/user-profile-form'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
      </div>

      <div className="max-w-2xl">
        <UserProfileForm 
          initialData={{
            name: session.user.name || '',
            email: session.user.email || ''
          }}
        />
      </div>
    </div>
  )
}

