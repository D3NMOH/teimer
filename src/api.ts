const API_URL = import.meta.env.VITE_API_URL || ''

export interface User {
  id: string
  email: string
}

export interface Session {
  user: User
  access_token: string
}

async function safeParseJson(res: Response): Promise<any> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch (e) {
    return null
  }
}

class AuthClient {
  private listeners: ((event: string, session: Session | null) => void)[] = []

  async getSession(): Promise<{ data: { session: Session | null } }> {
    const token = localStorage.getItem('teimer-token')
    if (!token) return { data: { session: null } }

    try {
      const res = await fetch(`${API_URL}/api/auth/session`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Session invalid')
      const data = await safeParseJson(res)
      if (!data?.user) throw new Error('Invalid session payload')
      return { data: { session: { user: data.user, access_token: token } } }
    } catch (e) {
      localStorage.removeItem('teimer-token')
      return { data: { session: null } }
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    this.listeners.push(callback)

    // Trigger initial check
    this.getSession().then(({ data }) => {
      callback('INITIAL', data.session)
    })

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter((l) => l !== callback)
          }
        }
      }
    }
  }

  async signUp({ email, password }: any): Promise<{ error: { message: string } | null }> {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, frontendUrl: window.location.origin })
      })
      const data = await safeParseJson(res)
      if (!res.ok) {
        return {
          error: {
            message: data?.message || `Server error (${res.status} ${res.statusText || ''})`.trim()
          }
        }
      }
      return { error: null }
    } catch (err: any) {
      return { error: { message: err.message } }
    }
  }

  async signInWithPassword({
    email,
    password
  }: any): Promise<{ error: { message: string } | null }> {
    try {
      const res = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await safeParseJson(res)
      if (!res.ok) {
        return {
          error: {
            message: data?.message || `Server error (${res.status} ${res.statusText || ''})`.trim()
          }
        }
      }

      if (!data?.token) {
        return { error: { message: 'Server did not return authentication token' } }
      }

      localStorage.setItem('teimer-token', data.token)

      const sessionObj = { user: data.user, access_token: data.token }
      this.listeners.forEach((l) => l('SIGNED_IN', sessionObj))
      return { error: null }
    } catch (err: any) {
      return { error: { message: err.message } }
    }
  }

  async signOut(): Promise<{ error: null }> {
    localStorage.removeItem('teimer-token')
    this.listeners.forEach((l) => l('SIGNED_OUT', null))
    return { error: null }
  }

  async resetPasswordForEmail(email: string): Promise<{ error: { message: string } | null }> {
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frontendUrl: window.location.origin })
      })
      const data = await safeParseJson(res)
      if (!res.ok) {
        return {
          error: {
            message: data?.message || `Request failed (${res.status} ${res.statusText || ''})`.trim()
          }
        }
      }
      return { error: null }
    } catch (err: any) {
      return { error: { message: err.message } }
    }
  }
}

class ApiClient {
  auth = new AuthClient()

  from(table: string) {
    if (table !== 'timer_chains') {
      throw new Error(`Unsupported table: ${table}`)
    }

    const getHeaders = () => {
      const token = localStorage.getItem('teimer-token')
      return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
    }

    return {
      select: (_columns?: string) => {
        return {
          order: async (
            column: string,
            { ascending }: { ascending: boolean } = { ascending: true }
          ) => {
            try {
              const res = await fetch(
                `${API_URL}/api/timer-chains?order=${column}&dir=${ascending ? 'asc' : 'desc'}`,
                {
                  headers: getHeaders()
                }
              )
              const data = await safeParseJson(res)
              if (!res.ok) {
                return {
                  data: null,
                  error: { message: data?.message || `Fetch failed (${res.status})` }
                }
              }
              return { data, error: null }
            } catch (err: any) {
              return { data: null, error: { message: err.message } }
            }
          }
        }
      },
      upsert: (payload: any) => {
        return {
          select: async () => {
            try {
              const res = await fetch(`${API_URL}/api/timer-chains`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
              })
              const data = await safeParseJson(res)
              if (!res.ok) {
                return {
                  data: null,
                  error: { message: data?.message || `Save failed (${res.status})` }
                }
              }
              return { data: [data], error: null }
            } catch (err: any) {
              return { data: null, error: { message: err.message } }
            }
          }
        }
      },
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            if (column !== 'id') throw new Error('Unsupported delete criteria')
            try {
              const res = await fetch(`${API_URL}/api/timer-chains/${value}`, {
                method: 'DELETE',
                headers: getHeaders()
              })
              const data = await safeParseJson(res)
              if (!res.ok) {
                return {
                  error: { message: data?.message || `Delete failed (${res.status})` }
                }
              }
              return { error: null }
            } catch (err: any) {
              return { error: { message: err.message } }
            }
          }
        }
      }
    }
  }
}

export const api = new ApiClient()
