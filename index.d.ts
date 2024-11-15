interface IMediaBase {
  // 媒体来源
  platform: string;
  // 媒体ID
  id: string;
}

declare interface IMusicItem extends IMediaBase {
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


type SupportMediaType = 'music' | 'album' | 'artist' | 'sheet' | 'lyric';
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

interface IMediaSourceResult {
  /** 请求URL所需要的headers */
  headers?: Record<string, string>;
  /** 请求URL所需要的user-agent */
  userAgent?: string;
  /** 音源 */
  url: string;
}

interface ILyricSource {
  rawLrc?: string; // 文本格式的歌词
  translation?: string; // 文本格式的翻译
}

interface IGetAlbumInfoResult {
  isEnd?: boolean;
  musicList: IMusicItem[],
  albumItem?: Partial<IAlbumItem>
}

interface IGetSheetInfoResult {
  isEnd?: boolean;
  musicList: IMusicItem[],
  sheetItem?: Partial<IMusicSheetItem>
}

type ArtistMediaType = 'music' | 'album';

interface ITopListInfoResult {
  isEnd?: boolean;
  topListItem?: IMusicSheetItem;
  musicList?: IMusicItem[];
}

interface ITag {
  // tag 的唯一标识
  id: string;
  // tag 标题
  title: string;
}

interface ITagGroup {
  // 分组标题
  title: string;
  // tag 列表
  data: ITag[];
}

interface IGetRecommendSheetTagsResult {
  // 固定的tag
  pinned?: ITag[];
  // 更多面板中的tag
  data?: ITagGroup[];
}

/**
 * 搜索
 * @param query 关键字
 * @param page 分页
 * @param type 搜索类型
 */
declare type PluginInstanceSearch = <T extends SupportMediaType>(
  query: string,
  page: number,
  type: T,
) => Promise<ISearchResult<T>>;

/**
 * 获取音乐详情
 * @param musicBase
 */
declare type PluginInstanceInfo = (
  musicBase: IMusicItem
) => Promise<Partial<IMusicItem> | null>;

declare type MusicQuality = "low" | "standard" | "high" | "super";

/**
 * 插件实体
 */
declare interface PluginInstance {
  // 插件名称
  platform: string,
  // 插件作者
  author: string,
  // 插件版本号
  version: string,
  // 插件更新地址
  srcUrl?: string,
  // 主键
  primaryKey: Array<string>,
  // 缓存策略
  cacheControl?: string,
  // 提示文案
  hints?: {
    importMusicItem: Array<string>,
    importMusicSheet: Array<string>,
  },

  search?: PluginInstanceSearch;
  /**
   * 获取音源
   * @param mediaItem 媒体类型
   * @param quality 音质
   */
  getMediaSource?: (
    mediaItem: IMusicItem,
    quality?: MusicQuality
  ) => Promise<IMediaSourceResult | null>;

  getMusicInfo?: PluginInstanceInfo;

  /**
   * 获取歌词，当音乐详情没有返回歌词时，或者主动搜索歌词时调用
   * @param musicItem 音乐项
   */
  getLyric?: (musicItem: IMusicItem) => Promise<ILyricSource | null>;

  /**
   * 获取专辑详情
   * @param albumItem 专辑项
   * @param page 页码
   */
  getAlbumInfo?: (albumItem: IAlbumItem, page: number) => Promise<IGetAlbumInfoResult>;

  /**
   * 获取歌单详情
   * @param sheetItem
   * @param page
   */
  getMusicSheetInfo?: (sheetItem: IMusicSheetItem, page: number) => Promise<IGetSheetInfoResult>;

  /**
   * 获取作者作品
   * @param artistItem
   * @param page
   * @param type
   */
  getArtistWorks?: <T extends ArtistMediaType>(
    artistItem: IArtistItem,
    page: number,
    type: T,
  ) => Promise<ISearchResult<T>>;

  /**
   * <p>导入单曲</p>
   * <p>一般来说，你需要在函数体内用正则表达式或者字符串匹配找到 url 或者 id，然后做进一步处理。</p>
   * @param urlLike 用户输入的文本，可能包含 url 或 id 等信息。
   */
  importMusicItem?: (urlLike: string) => Promise<IMusicItem>;

  /**
   * <p>导入歌单</p>
   * <p>一般来说，你需要在函数体内用正则表达式或者字符串匹配找到 url 或者 id，然后做进一步处理。</p>
   * @param urlLike 用户输入的文本，可能包含 url 或 id 等信息。
   */
  importMusicSheet?: (urlLike: string) => Promise<IMusicItem[]>;

  /**
   * 获取榜单详情
   * @param topListItem 榜单条目，即 getTopLists 返回的榜单分组列表中的某一个 IMusicSheetItem
   * @param page  页码，从 1 开始
   */
  getTopListDetail?: (
    topListItem: IMusicSheetItem,
    page: number,
  ) => Promise<ITopListInfoResult>;

  /**
   * 获取推荐歌单 tag
   */
  getRecommendSheetTags?: () => Promise<IGetRecommendSheetTagsResult>;

  /**
   * 获取某个 tag 下的所有歌单
   * @param tag 标签
   * @param page 分页
   */
  getRecommendSheetsByTag?: (
    tag: ITag,
    page?: number
  ) => Promise<{
    isEnd: boolean;
    data: Array<IMusicSheetItem>;
  }>;

}