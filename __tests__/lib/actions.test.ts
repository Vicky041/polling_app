import { createPoll } from '../../lib/actions'
import { 
  createMockFormData, 
  createMockPollOptions, 
  createMockUser, 
  createMockPoll
} from '../utils/test-my-utils'

// Mock Next.js functions
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn()
      }))
    }))
  }))
}

jest.mock('../../lib/supabase-server', () => ({
  createServerSupabaseClient: () => mockSupabaseClient
}))

describe('Poll Creation Actions - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication Validation', () => {
    it('should throw error when user is not authenticated', async () => {
      // Arrange
      ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated')
      })
      
      const formData = createMockFormData({
        title: 'Test Poll',
        description: 'Test Description',
        options: JSON.stringify(createMockPollOptions(2))
      })

      // Act & Assert
      await expect(createPoll(formData)).rejects.toThrow('You must be logged in to create a poll')
    })

    it('should throw error when auth error occurs', async () => {
      // Arrange
      ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: new Error('Auth error')
      })
      
      const formData = createMockFormData({
        title: 'Test Poll',
        description: 'Test Description',
        options: JSON.stringify(createMockPollOptions(2))
      })

      // Act & Assert
      await expect(createPoll(formData)).rejects.toThrow('You must be logged in to create a poll')
    })
  })

  describe('Input Validation', () => {
    beforeEach(() => {
      // Setup authenticated user for validation tests
      ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: createMockUser() },
        error: null
      })
    })

    it('should throw error when title is empty', async () => {
      // Arrange
      const formData = createMockFormData({
        title: '',
        description: 'Test Description',
        options: JSON.stringify(createMockPollOptions(2))
      })

      // Act & Assert
      await expect(createPoll(formData)).rejects.toThrow('Poll title is required')
    })

    it('should throw error when title is only whitespace', async () => {
      // Arrange
      const formData = createMockFormData({
        title: '   ',
        description: 'Test Description',
        options: JSON.stringify(createMockPollOptions(2))
      })

      // Act & Assert
      await expect(createPoll(formData)).rejects.toThrow('Poll title is required')
    })

    it('should throw error when less than 2 options provided', async () => {
      // Arrange
      const formData = createMockFormData({
        title: 'Test Poll',
        description: 'Test Description',
        options: JSON.stringify([{ text: 'Only one option' }])
      })

      // Act & Assert
      await expect(createPoll(formData)).rejects.toThrow('At least 2 options are required')
    })

    it('should throw error when options is not an array', async () => {
      // Arrange
      const formData = createMockFormData({
        title: 'Test Poll',
        description: 'Test Description',
        options: JSON.stringify('invalid options')
      })

      // Act & Assert
      await expect(createPoll(formData)).rejects.toThrow('At least 2 options are required')
    })

    it('should throw error when options JSON is invalid', async () => {
      // Arrange
      const formData = createMockFormData({
      title: 'Test Poll',
      description: 'Test description',
      options: 'invalid json'
    })

      // Act & Assert
      await expect(createPoll(formData)).rejects.toThrow()
    })
  })

  describe('Data Processing Validation', () => {
    beforeEach(() => {
      // Setup authenticated user
      ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: createMockUser() },
        error: null
      })
    })

    it('should process valid poll data correctly', async () => {
      // Arrange
      const mockPoll = createMockPoll()
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockPoll,
            error: null
          })
        })
      })
      
      ;(mockSupabaseClient.from as jest.Mock)
        .mockReturnValueOnce({ insert: mockInsert })
        .mockReturnValueOnce({ insert: jest.fn().mockResolvedValue({ error: null }) })

      const formData = createMockFormData({
        title: '  Test Poll  ',
        description: '  Test Description  ',
        options: JSON.stringify(createMockPollOptions(2))
      })

      // Act & Assert
      try {
        await createPoll(formData)
      } catch (error) {
        // Ignore redirect error for this test
      }

      // Verify poll was created with trimmed data
      expect(mockInsert).toHaveBeenCalledWith({
        title: 'Test Poll',
        description: 'Test Description',
        created_by: 'test-user-id'
      })
    })
  })
})