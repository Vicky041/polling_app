// Mock Next.js functions first
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

import { createPoll } from '../../lib/actions'
import { createMockFormData, createMockPollOptions, createMockUser, createMockPoll } from '../utils/test-my-utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>

// Mock Supabase client for integration testing
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn()
}

jest.mock('../../lib/supabase-server', () => ({
  createServerSupabaseClient: () => mockSupabaseClient
}))

describe('Poll Creation Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully create a poll with complete flow', async () => {
    // Arrange - Setup successful authentication
    const mockUser = createMockUser('integration-test-user')
    ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    // Setup successful poll creation
    const mockPoll = createMockPoll('integration-test-poll')
    const mockPollInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: mockPoll,
          error: null
        })
      })
    })

    // Setup successful options creation
    const mockOptionsInsert = jest.fn().mockResolvedValue({
      error: null
    })

    // Configure mock to return different values for polls and poll_options tables
    ;(mockSupabaseClient.from as jest.Mock)
      .mockReturnValueOnce({ insert: mockPollInsert })
      .mockReturnValueOnce({ insert: mockOptionsInsert })

    // Create form data with valid poll information
    const pollOptions = [
      { text: 'Integration Option 1' },
      { text: 'Integration Option 2' },
      { text: 'Integration Option 3' }
    ]
    
    const formData = createMockFormData({
      title: '  Integration Test Poll  ',
      description: '  This is an integration test  ',
      options: JSON.stringify(pollOptions)
    })

    // Act - Execute the complete poll creation flow
    try {
      await createPoll(formData)
    } catch (error) {
      // Expected to throw due to redirect mock
    }

    // Assert - Verify authentication was checked
    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1)

    // Verify poll was created with correct data
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('polls')
    expect(mockPollInsert).toHaveBeenCalledWith({
      title: 'Integration Test Poll',
      description: 'This is an integration test',
      created_by: 'integration-test-user'
    })

    // Verify poll options were created
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('poll_options')
    expect(mockOptionsInsert).toHaveBeenCalledWith([
      {
        poll_id: 'integration-test-poll',
        text: 'Integration Option 1',
        votes: 0
      },
      {
        poll_id: 'integration-test-poll',
        text: 'Integration Option 2',
        votes: 0
      },
      {
        poll_id: 'integration-test-poll',
        text: 'Integration Option 3',
        votes: 0
      }
    ])

    // Verify cache revalidation and redirect
    expect(mockRevalidatePath).toHaveBeenCalledWith('/polls')
    expect(mockRedirect).toHaveBeenCalledWith('/polls/integration-test-poll')
  })

  it('should handle database errors gracefully in complete flow', async () => {
    // Arrange - Setup successful authentication
    const mockUser = createMockUser('error-test-user')
    ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    // Setup poll creation failure
    const mockPollInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database connection failed')
        })
      })
    })

    ;(mockSupabaseClient.from as jest.Mock).mockReturnValue({
      insert: mockPollInsert
    })

    const formData = createMockFormData({
      title: 'Error Test Poll',
      description: 'This should fail',
      options: JSON.stringify(createMockPollOptions(2))
    })

    // Act & Assert - Should throw error when database fails
    await expect(createPoll(formData)).rejects.toThrow('Failed to create poll')

    // Verify authentication was still checked
    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1)

    // Verify poll creation was attempted
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('polls')
    expect(mockPollInsert).toHaveBeenCalled()

    // Verify no cache revalidation or redirect occurred
    expect(mockRevalidatePath).not.toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should handle poll options creation failure in complete flow', async () => {
    // Arrange - Setup successful authentication and poll creation
    const mockUser = createMockUser('options-error-user')
    ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    const mockPoll = createMockPoll('options-error-poll')
    const mockPollInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: mockPoll,
          error: null
        })
      })
    })

    // Setup options creation failure
    const mockOptionsInsert = jest.fn().mockResolvedValue({
      error: new Error('Options creation failed')
    })

    ;(mockSupabaseClient.from as jest.Mock)
      .mockReturnValueOnce({ insert: mockPollInsert })
      .mockReturnValueOnce({ insert: mockOptionsInsert })

    const formData = createMockFormData({
      title: 'Options Error Test',
      description: 'Options should fail',
      options: JSON.stringify(createMockPollOptions(2))
    })

    // Act & Assert - Should throw error when options creation fails
    await expect(createPoll(formData)).rejects.toThrow('Failed to create poll options')

    // Verify poll was created successfully
    expect(mockPollInsert).toHaveBeenCalled()

    // Verify options creation was attempted
    expect(mockOptionsInsert).toHaveBeenCalled()

    // Verify no cache revalidation or redirect occurred
    expect(mockRevalidatePath).not.toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should validate complete data flow with edge cases', async () => {
    // Arrange - Setup authentication
    const mockUser = createMockUser('edge-case-user')
    ;(mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    // Setup successful creation
    const mockPoll = createMockPoll('edge-case-poll')
    const mockPollInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: mockPoll,
          error: null
        })
      })
    })

    const mockOptionsInsert = jest.fn().mockResolvedValue({ error: null })

    ;(mockSupabaseClient.from as jest.Mock)
      .mockReturnValueOnce({ insert: mockPollInsert })
      .mockReturnValueOnce({ insert: mockOptionsInsert })

    // Test with edge case data (empty description, whitespace in options)
    const edgeCaseOptions = [
      { text: '  Option with spaces  ' },
      { text: 'Normal option' }
    ]
    
    const formData = createMockFormData({
      title: '  Edge Case Poll  ',
      description: '',  // Empty description
      options: JSON.stringify(edgeCaseOptions)
    })

    // Act
    try {
      await createPoll(formData)
    } catch (error) {
      // Expected redirect error
    }

    // Assert - Verify data was processed correctly
    expect(mockPollInsert).toHaveBeenCalledWith({
      title: 'Edge Case Poll',
      description: null,  // Empty description becomes null
      created_by: 'edge-case-user'
    })

    expect(mockOptionsInsert).toHaveBeenCalledWith([
      {
        poll_id: 'edge-case-poll',
        text: 'Option with spaces',  // Trimmed
        votes: 0
      },
      {
        poll_id: 'edge-case-poll',
        text: 'Normal option',
        votes: 0
      }
    ])
  })
})