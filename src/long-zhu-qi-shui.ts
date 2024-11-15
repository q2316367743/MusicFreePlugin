import axios from "axios";

const platform = "龙珠API-汽水v音乐";
const baseURL = 'https://www.hhlqilongzhu.cn//api/dg_qishuimusic.php';
const key = 'msg';
const fileName = 'long-zhu-qi-shui';

/**
 * 歌曲搜索
 * @param query 查询关键字
 * @param page 页码
 * @param type 类型
 */
async function search<T extends SupportMediaType>(
  query: string,
  page: number,
  type: T
): Promise<ISearchResult<T>> {
  // 搜索的具体逻辑
  if (type === "music") {
    const rsp = await axios.get(
      `${baseURL}?${key}=${encodeURIComponent(
        query
      )}&type=json`,
      {
        responseType: "json",
      }
    );
    const data = rsp.data.data as Array<any>;
    return {
      isEnd: true,
      // @ts-ignore
      data: data.map((e) => ({
        platform: platform,
        id: e.n + "",
        title: e.title,
        artist: e.singer,
      })),
    };
  } else {
    return {
      isEnd: true,
      data: [],
    };
  }
}

/**
 * 获取音乐详情
 * @param  mediaItem 音乐项
 * @returns比较完整的音乐项
 */
async function getMusicInfo(
  mediaItem: IMusicItem
): Promise<Partial<IMusicItem>> {
  const {id, title} = mediaItem;

  const rsp = await axios.get(
    `${baseURL}?${key}=${encodeURIComponent(
      title
    )}&type=json&n=${id}`,
    {
      responseType: "json",
    }
  );
  const data = rsp.data;
  return {
    id: id,
    platform: platform,
    title: data.title,
    artist: data.singer,
    artwork: data.cover,
    url: data.link,
    rawLrc: data.lrc
  };
}

export default {
  // 插件名称
  platform: platform,
  // 插件作者
  author: "落雨不悔",
  // 插件版本号
  version: "1.0.1",
  // 插件更新地址
  srcUrl: `https://static.esion.xyz/public/源/MusicFree/${fileName}.js`,
  // 主键
  primaryKey: ["id"],
  // 缓存策略
  cacheControl: "no-cache",
  // 提示文案
  hints: {
    importMusicItem: [
      "1. 导入单曲时注意，输入的 URL 应该符合 xxx 格式",
      "2. 导入单曲的第二条注意事项",
    ],
    importMusicSheet: [
      "1. 导入歌单时注意，输入的 URL 应该符合 xxx 格式",
      "2. 导入歌单的第二条注意事项",
    ],
  },

  /**
   * 歌曲搜索
   * @param query 查询关键字
   * @param page 页码
   * @param type 类型
   */
  async search<T extends SupportMediaType>(
    query: string,
    page: number,
    type: T
  ): Promise<ISearchResult<T>> {
    return search(query, page, type);
  },
  /**
   * 获取音乐的真实 url
   *
   * @param mediaItem 音乐项
   * @param quality 音质
   */
  async getMediaSource(
    mediaItem: IMusicItem,
    quality: MusicQuality
  ): Promise<IMediaSourceResult> {
    const data = await getMusicInfo(mediaItem);
    return {
      url: data.url!,
      headers: {},
      userAgent: "",
    };
  },
  /**
   * 获取音乐详情
   * @param  musicItem 音乐项
   * @returns  比较完整的音乐项
   */
  getMusicInfo(musicItem: IMusicItem): Promise<Partial<IMusicItem>> {
    return getMusicInfo(musicItem);
  },
  /**
   * 获取歌词
   * @param  musicItem  音乐项
   */
  async getLyric(musicItem: IMusicItem): Promise<ILyricSource | null> {
    const data = await getMusicInfo(musicItem);
    return {
      rawLrc: data.rawLrc,
    };
  },
  // // 获取专辑详情
  // async getAlbumInfo(albumItem, page) {
  //   // ...
  // },
  // // 获取歌单详情
  // async getMusicSheetInfo(sheetItem, page) {
  //   // ...
  // },
  // // 获取作者作品
  // async getArtistWorks(artistItem, page, type) {
  //   // ...
  // },
  // // 导入单曲
  // async importMusicItem(urlLike) {
  //   // ...
  // },
  // // 导入歌单
  // async importMusicSheet(urlLike) {
  //   // ...
  // },
  // // 获取榜单列表
  // async getTopLists() {
  //   // ...
  // },
  // // 获取榜单详情
  // async getTopListDetail(topListItem, page) {
  //   // ...
  // },
  // // 获取推荐歌单 tag
  // async getRecommendSheetTags() {
  //   // ...
  // },
  // // 获取某个 tag 下的所有歌单
  // async getRecommendSheetsByTag(tag, page) {
  //   // ...
  // },
};
