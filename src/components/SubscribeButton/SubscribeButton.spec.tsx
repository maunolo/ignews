import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'
import { CustomSession } from '../../types'

jest.mock('next-auth/client')

jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirect to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: 'John Doe', email: 'john.doe@example.com' },
        expires: 'fake-expires',
        activeSubscription: { name: 'fake-subscription' }
      },
      false
    ] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})
