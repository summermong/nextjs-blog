import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkHtml from "remark-html";
import { remark } from "remark";

// 현재 경로에 'posts' 경로 추가
const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // /posts 파일 이름 잡아주기 (['pre-rendering.md', ...])
  const fileNames = fs.readdirSync(postsDirectory);

  // 파일 이름을 하나씩 꺼내서 .md를 제거한 형태로 id 만들기
  const allPostsData = fileNames.map((fileNames) => {
    const id = fileNames.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileNames);

    // 콘텐츠 읽어주고 matter로 변환 시켜주기
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
    };
  });

  // Sorting
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  // 파일 이름이 fileNames 배열로 들어옴
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileNames) => {
    return {
      params: {
        id: fileNames.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  // remark 사용 전 모듈 다운 (remark-html)
  const processedContent = await remark()
    .use(remarkHtml)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string }),
  };
}
