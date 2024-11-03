'use client'

export const encrypt = (text: string): string => {
  try {
    // For development, just return the text
    return text
  } catch (error) {
    console.error('Encryption error:', error)
    return text
  }
}

export const decrypt = (text: string): string => {
  try {
    // For development, just return the text
    return text
  } catch (error) {
    console.error('Decryption error:', error)
    return text
  }
}
