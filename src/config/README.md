# 全局配置
该目录放置一些全局配置信息，如果有需要可以在此目录自行增加相关配置。
- `index.js`: 系统的一些基本配置，包含基础、token、路由、样式等，可以根据自己需要添加。
- `dictionary.js`: 用于配置一些枚举值，用作字典映射，提取到此处统一管理有几点好处，一是可以公用，不会存在多份映射，防止映射值实现的差异，二是便于维护，当映射需要更改的时候，只需要在这里维护，而不需要在每个使用的地方去修改。
