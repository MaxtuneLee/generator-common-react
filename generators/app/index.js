"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");
// 5.0.0版本需要动态引入install
const _ = require("lodash");
_.extend(Generator.prototype, require("yeoman-generator/lib/actions/install"));

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the sensational ${chalk.red(
          "generator-common-react"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "🔤️ 请输入你的项目名称: ",
        default: "react"
      },
      {
        type: "input",
        name: "description",
        message: "🤔️ 请输入你的项目描述: ",
        default: "a react project"
      },
      {
        type: "input",
        name: "author",
        message: "😸️ 作者名称: ",
        default: "hello"
      },
      {
        type: "input",
        name: "email",
        message: "📮️ 作者邮箱: ",
        default: "hello@gmail.com"
      },
      {
        type: "input",
        name: "license",
        message: "✅️ 开源许可证: ",
        default: "MIT"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.props.fullName = this.props.name;
    });
  }

  // 未匹配任何生命周期方法的非私有方法均在此环节*自动*执行
  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `\n🔔️ ️你的项目要在名为 ${this.props.name} 的文件夹里面\n🤖️ 别担心，我会自动给你创建所需要的文件和文件夹\n`
      );

      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  // 依据模板进行新项目结构的写操作
  writing() {
    this.log("\n📦️ 正在写入中...\n");

    this.__writingCopy(["package.json"], {
      name: this.props.name,
      fullName: this.props.fullName,
      description: this.props.description,
      author: this.props.author,
      email: this.props.email,
      license: this.props.license
    });
    this.__writingCopy(["README.md"], {
      name: this.props.name,
      fullName: this.props.fullName,
      description: this.props.description,
      author: this.props.author,
      year: new Date().getFullYear()
    });
    this.__writingCopy([
      ".git",
      "public",
      ".husky",
      "src",
      "cli",
      ".eslintignore",
      ".eslintrc.js",
      ".gitignore",
      ".prettierignore",
      ".prettierrc",
      "craco.config.js",
      "tsconfig.json"
    ]);
  }

  __writingCopy(filePath, params) {
    filePath.forEach(item => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        params
      );
    });
  }

  install() {
    this.yarnInstall();
  }
};
