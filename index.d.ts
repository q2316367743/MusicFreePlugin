interface IMediaBase {
  // 媒体来源
  platform: string;
  // 媒体ID
  id: string;
}

interface IMusicItem extends IMediaBase {
  // 媒体来源
  platform: string;
  // 媒体ID
  id: string;
  /** 作者 */
  artist: string;
  /** 歌曲标题 */
  title: string;
  /** 时长(s) */
  duration?: number;
  /** 专辑名 */
  album?: string;
  /** 专辑封面图 */
  artwork?: string;
  /** 默认音源 */
  url?: string;
  /** 歌词URL */
  lrc?: string;
  /** 歌词文本 */
  rawLrc?: string;
  // 其他，你可以在这里扩展你自己的字段
  [k: string | number | symbol]: any;
}

interface IArtistItem extends IMediaBase {
  // 媒体来源
  platform: string;
  /** id */
  id: string;
  /** 作者名 */
  name: string;
  /** 粉丝数 */
  fans?: number;
  /** 简介 */
  description?: string;
  /** 头像 */
  avatar: string;
  /** 作者的单曲列表 */
  musicList?: IMusicItem[];
  /** 作者的专辑列表 */
  albumList?: IAlbumItem[];
}

interface IAlbumItem extends IMediaBase {
  // 媒体来源
  platform: string;
  // 媒体ID
  id: string;
  /** 封面图 */
  artwork?: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 作品总数 */
  worksNum?: number;
  /** 播放次数 */
  playCount?: number;
  /** 播放列表 */
  musicList?: IMusicItem[];
  /** 歌单创建日期 */
  createAt?: number;
  // 歌单作者
  artist?: string;
}

interface IMusicSheetItem extends IMediaBase {
  // 媒体来源
  platform: string;
  // 媒体ID
  id: string;
  /** 作者 */
  artist: string;
  /** 歌曲标题 */
  title: string;
  /** 时长(s) */
  duration?: number;
  /** 专辑名 */
  album?: string;
  /** 专辑封面图 */
  artwork?: string;
  /** 默认音源 */
  url?: string;
  /** 歌词URL */
  lrc?: string;
  /** 歌词文本 */
  rawLrc?: string;
  // 其他，你可以在这里扩展你自己的字段
  [k: string | number | symbol]: any;
}

declare type SupportMediaType = "music" | "album" | "artist" | "sheet" | "lyric";
declare type MusicQuality = "low" | "standard" | "high" | "super";

type SupportMediaItem = {
    music: IMusicItem;
    album: IAlbumItem;
    artist: IArtistItem;
    sheet: IMusicSheetItem;
    lyric: IMusicItem;
};
interface ISearchResult<T extends SupportMediaType> {
    isEnd?: boolean;
    data: SupportMediaItem[T][];
}

/** 搜索函数签名 */
declare type SearchFunc = <T extends SupportMediaType>(
    query: string,
    page: number,
    type: T,
) => Promise<ISearchResult<T>>


declare interface GetMediaSourceResult {
  url: string;
  headers: Record<string, string>;
  userAgent: string;
}

declare interface ILyricSource {
  rawLrc?: string; // 文本格式的歌词
  translation?: string; // 文本格式的翻译
}

declare const module = {
  exports: any
}