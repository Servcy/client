/* eslint-disable no-useless-escape */
/*
  This file contains all the validators that are used in the application
*/

export const validateEmail = (input: string) => {
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(input) || process.env.NODE_ENV === "development" || input.endsWith("@servcy.com")
}

export const isWorkspaceEmail = (email: string) => {
    return email.match(
        /^[a-zA-Z0-9._%+-]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!live.com)(?!outlook.com)[a-zA-Z0-9_-]+.[a-zA-Z0-9-.]{2,61}$/
    )
}

export const validatePhone = (input: string) => {
    const phoneRegex = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
    return phoneRegex.test(input)
}

export const validateOtp = (input: string) => {
    const otpRegex = /^\d{6}$/
    return otpRegex.test(input)
}

export const validateWebUrl = (input: string) => {
    const urlRegex =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/ // eslint-disable-next-line no-useless-escape
    return urlRegex.test(input)
}
