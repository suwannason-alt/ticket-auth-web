'use server'

import { getPublicEnvByName } from '@daniel-rose/envex/server'

export default async function getENV() {
    const userAPI = await getPublicEnvByName('NEXT_PUBLIC_USER_API')
    const credentialAPI = await getPublicEnvByName('NEXT_PUBLIC_CREDENTIAL_API')

    return { userAPI, credentialAPI }
}