import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
      ...(matterResult.data as { data: string; title: string }),
    };
  });

  // Sorting
  return allPostsData.sort((a, b) => {
    if (a.data < b.data) {
      return 1;
    } else {
      return -1;
    }
  });
}
