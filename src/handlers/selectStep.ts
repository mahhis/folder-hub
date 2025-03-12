import { type Message } from '@grammyjs/types'
import { findOrCreateUrl, isURL, isURLToFolder } from '@/models/Url'
import { handleNext } from '@/handlers/next'
import Context from '@/models/Context'
import handleCategorySelection from '@/handlers/streamSelection'
import handleChangeCategories from '@/handlers/changeStreamSelection'
import handleConfirmation from '@/handlers/confiramtion'
import handleUrl from '@/handlers/url'
import i18n from '@/helpers/i18n'
import sendOptions from '@/helpers/sendOptions'

export default async function selectStep(ctx: Context) {
  const message = ctx.msg!

  if (ctx.dbuser.step === 'confirmation') {
    if (isYesOrNo(ctx, message)) {
      return await handleConfirmation(ctx, message)
    } else {
      return await ctx.replyWithLocalization('yes_no', sendOptions(ctx))
    }
  }
  if (isURL(message.text!)) {
    if (isURLToFolder(message.text!)) {
      return await handleUrl(ctx, message)
    } else {
      return await ctx.replyWithLocalization('broken_url', sendOptions(ctx))
    }
  }
  if (isNextFolder(ctx, message)) {
    return await handleNext(ctx)
  }
  if (isChangeCategories(ctx, message)) {
    return await handleChangeCategories(ctx)
  }
  if (isSpecificRandom(ctx, message)) {
    return await handleCategorySelection(ctx, message)
  }
}

function isNextFolder(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'next')
}

function isChangeCategories(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'change')
}

function isYesOrNo(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'yes') ||
    message.text == i18n.t(ctx.dbuser.language, 'no')
  )
}

function isSpecificRandom(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'random') ||
    message.text == i18n.t(ctx.dbuser.language, 'specific')
  )
}
