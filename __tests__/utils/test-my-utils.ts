import { jest } from '@jest/globals'

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn()
      }))
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn()
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn()
    })),
    delete: jest.fn(() => ({
      eq: jest.fn()
    }))
  }))
}

// Mock createServerSupabaseClient
jest.mock('../../lib/supabase-server', () => ({
  createServerSupabaseClient: () => mockSupabaseClient
}))

// Helper function to create mock FormData
export function createMockFormData(data: Record<string, string>): FormData {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  return formData
}

// Helper function to create mock poll options
export function createMockPollOptions(count: number = 3) {
  return Array.from({ length: count }, (_, i) => ({
    text: `Option ${i + 1}`
  }))
}

// Helper function to create mock user
export function createMockUser(id: string = 'test-user-id') {
  return {
    id,
    email: 'test@example.com',
    created_at: new Date().toISOString()
  }
}

// Helper function to create mock poll
export function createMockPoll(id: string = 'test-poll-id') {
  return {
    id,
    title: 'Test Poll',
    description: 'Test Description',
    created_by: 'test-user-id',
    created_at: new Date().toISOString()
  }
}

// Reset all mocks
export function resetAllMocks() {
  jest.clearAllMocks()
}

// Simple test to prevent "no tests" error
describe('Test Utils', () => {
  it('should create mock FormData correctly', () => {
    const formData = createMockFormData({ title: 'Test', description: 'Test desc' })
    expect(formData.get('title')).toBe('Test')
    expect(formData.get('description')).toBe('Test desc')
  })

  it('should create mock poll options', () => {
    const options = createMockPollOptions(2)
    expect(options).toHaveLength(2)
    expect(options[0].text).toBe('Option 1')
    expect(options[1].text).toBe('Option 2')
  })

  it('should create mock user', () => {
    const user = createMockUser('test-id')
    expect(user.id).toBe('test-id')
    expect(user.email).toBe('test@example.com')
  })

  it('should create mock poll', () => {
    const poll = createMockPoll('poll-id')
    expect(poll.id).toBe('poll-id')
    expect(poll.title).toBe('Test Poll')
  })
})