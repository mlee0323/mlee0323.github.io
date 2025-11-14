const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

function escapeCodeBlock(body) {
  const regex = /```([\s\S]*?)```/g;
  return body.replace(regex, function (match, htmlBlock) {
    return "\n{% raw %}\n```" + htmlBlock.trim() + "\n```\n{% endraw %}\n";
  });
}

function replaceTitleOutsideRawBlocks(body) {
  const rawBlocks = [];
  const placeholder = "%%RAW_BLOCK%%";
  body = body.replace(/{% raw %}[\s\S]*?{% endraw %}/g, (match) => {
    rawBlocks.push(match);
    return placeholder;
  });

  const regex = /\n#[^\n]+\n/g;
  body = body.replace(regex, function (match) {
    return "\n" + match.replace("\n#", "\n##");
  });

  rawBlocks.forEach(block => {
    body = body.replace(placeholder, block);
  });

  return body;
}

// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });

(async () => {
  // ensure directory exists
  const root = "_posts";
  fs.mkdirSync(root, { recursive: true });

  const databaseId = process.env.DATABASE_ID;
  let response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "공개",
      checkbox: {
        equals: true,
      },
    },
  });

  const pages = response.results;
  while (response.has_more) {
    const nextCursor = response.next_cursor;
    response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: nextCursor,
      filter: {
        property: "공개",
        checkbox: {
          equals: true,
        },
      },
    });
    pages.push(...response.results);
  }

  for (const r of pages) {
    const id = r.id;
    // date
    let date = moment(r.created_time).format("YYYY-MM-DD");
    let pdate = r.properties?.["날짜"]?.["date"]?.["start"];
    if (pdate) {
      date = moment(pdate).format("YYYY-MM-DD");
    }
    // title
    let title = id;
    let ptitle = r.properties?.["게시물"]?.["title"];
    if (ptitle?.length > 0) {
      title = ptitle[0]?.["plain_text"];
    }
    // tags
    let tags = [];
    let ptags = r.properties?.["태그"]?.["multi_select"] || [];
    for (const t of ptags) {
      const n = t?.["name"];
      if (n) {
        tags.push(n);
      }
    }
    // categories
    let cats = [];
    let pcats = r.properties?.["카테고리"]?.["multi_select"] || [];
    for (const t of pcats) {
      const n = t?.["name"];
      if (n) {
        cats.push(n);
      }
    }

let fmdifficulty = ""; // 난이도 문자열
    let fmretest = "";     // Retest 문자열

    // 1. cats 배열에 'C.Test'가 포함되어 있는지 확인
    const isCTest = cats.includes("C.Test");

    if (isCTest) {
      // 2. 'C.Test'가 맞다면, '난이도' 속성을 읽음 (multi_select)
      let difficulties = [];
      let pDifficulties = r.properties?.["난이도"]?.["multi_select"] || [];
      for (const t of pDifficulties) {
        const n = t?.["name"];
        if (n) {
          difficulties.push(n); // 배열에 추가
        }
      }
      // Jekyll 머리말 형식으로 변환
      if (difficulties.length > 0) {
        fmdifficulty = "\ndifficulty: [" + difficulties.join(", ") + "]";
      }

      // 3. 'C.Test'가 맞다면, 'Retest' 속성을 읽음 (multi_select)
      let retests = [];
      let pRetests = r.properties?.["Retest"]?.["multi_select"] || [];
      for (const t of pRetests) {
        const n = t?.["name"];
        if (n) {
          retests.push(n); // 배열에 추가
        }
      }
      // Jekyll 머리말 형식으로 변환
      if (retests.length > 0) {
        fmretest = "\nretest: [" + retests.join(", ") + "]";
      }
    }
    
    // frontmatter
    let fmtags = "";
    let fmcats = "";
    if (tags.length > 0) {
      fmtags += "\ntags: [" + tags.join(", ") + "]";
    }
    if (cats.length > 0) {
      fmcats += "\ncategories: [" + cats.join(", ") + "]";
    }
    const fm = `---
layout: post
date: ${date}
title: "${title}"${fmtags}${fmcats}${fmdifficulty}${fmretest}
---
`;

    // notion -> markdown
    const mdblocks = await n2m.pageToMarkdown(id);
    const { parent } = n2m.toMarkdownString(mdblocks) || {};
    let md = parent || "";

    if (!md) {
      console.log(`Skipping page ${title} (${id}) because it returned empty markdown`);
      continue;
    }

    md = escapeCodeBlock(md);
    md = replaceTitleOutsideRawBlocks(md);

    const ftitle = `${date}-${title.replaceAll(" ", "-")}.md`;

    let index = 0;
    let edited_md = md.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      function (match, p1, p2, p3) {
        const dirname = path.join("assets/img", ftitle);
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true });
        }
        const filename = path.join(dirname, `${index}.png`);

        axios({
          method: "get",
          url: p2,
          responseType: "stream",
        })
          .then(function (response) {
            let file = fs.createWriteStream(`${filename}`);
            response.data.pipe(file);
          })
          .catch(function (error) {
            console.log(error);
          });

        let res;
        if (p1 === "") res = "";
        else res = `_${p1}_`;

        return `![${index++}](/${filename})${res}`;
      }
    );

    //writing to file
    fs.writeFile(path.join(root, ftitle), fm + edited_md, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
})();
