import { getAttribute, queryElement } from '../utils/selectors';
import type {
  FacebookSocialShare,
  PinterestSocialShare,
  SocialShare,
  SocialShareTypes,
  XSocialShare,
} from './../utils/types';

export function collectFacebookData(
  trigger: HTMLElement,
  instance: string | null,
  scope: HTMLElement | undefined
): FacebookSocialShare {
  const socialData = collectSocialData(trigger, 'facebook', instance, scope);

  const hashtagsElement = queryElement('facebook-hashtags', { instance, scope });
  const hashtagsText = hashtagsElement ? hashtagsElement.textContent : null;

  return {
    ...socialData,
    type: 'facebook',
    hashtags: hashtagsText,
  };
}

export function collectXData(
  trigger: HTMLElement,
  instance: string | null,
  scope: HTMLElement | undefined
): XSocialShare {
  const socialData = collectSocialData(trigger, 'x', instance, scope);

  const hashtagsElement = queryElement('x-hashtags', { instance, scope });
  const hashtagsText =
    hashtagsElement && hashtagsElement.textContent ? hashtagsElement.textContent.replace(/[^a-zA-Z0-9_,]/g, '') : null;

  const usernameElement = queryElement('x-username', { instance, scope });
  const userNameText = usernameElement ? usernameElement.textContent : null;

  return {
    ...socialData,
    type: 'x',
    hashtags: hashtagsText,
    username: userNameText,
  };
}

export function collectPinterestData(
  trigger: HTMLElement,
  instance: string | null,
  scope: HTMLElement | undefined
): PinterestSocialShare {
  const socialData = collectSocialData(trigger, 'pinterest', instance, scope);

  const imageElement = queryElement<HTMLImageElement>('pinterest-image', { instance, scope });
  const imageSrc = imageElement && imageElement.src ? imageElement.src : null;

  const descriptionElement = queryElement('pinterest-description', { instance, scope });

  const descriptionText = descriptionElement ? descriptionElement.textContent : null;

  return {
    ...socialData,
    type: 'pinterest',
    image: imageSrc,
    description: descriptionText,
  };
}

export function collectSocialData(
  socialShareButton: HTMLElement,
  elementKey: SocialShareTypes,
  instance: string | null,
  scope: HTMLElement | undefined
): SocialShare {
  const width = getAttribute(socialShareButton, 'width');
  const height = getAttribute(socialShareButton, 'height');

  const contentElement = queryElement('content', { instance, scope });
  const contentText = contentElement ? contentElement.textContent : null;

  const urlElement = queryElement('url', { instance, scope });
  const contentUrl = urlElement && urlElement.textContent ? urlElement.textContent : window.location.href;

  return {
    content: contentText,
    url: contentUrl,
    width,
    height,
    type: elementKey,
  };
}
