---
title: 为 Hexo 博客添加评论系统
tags:
  - 博客
  - 评论
  - Hexo
  - 多说
categories:
  - 实验室
date: 2017-03-23 21:49:10
updated: 2017-03-23 21:49:10
thumbnail: https://blog.nfz.yecdn.com/img/thumbnails/add-comment-system-to-hexo.png!blogth
---

>  由于 Hexo 本身已经弃用了 swig 支持，所以本文教程是根据 ejs 语言来写的。如果使用了如 NexT 等基于 swig 的 Hexo 主题，请自行切换。

Hexo 是一款静态博客，所以不像 WordPress 或者 Typecho 这类动态博客一样支持原生评论系统，所以一般需要引入第三方评论系统。国内常见的评论系统有多说、友言、畅言等，国外的有 Disqus 和 Moss。

> 在写作本文的时候，多说已经宣布即将暂停服务，很多使用多说的人都在寻找解决方案；加上网络上找到的解决方案大多都不具备通用性，而且也不具备太多指导意义，这也是为什么我写作本文的原因。

> **强烈建议：**在阅读本文并根据本文进行操作前，请仔细阅读 Hexo 的 API 和主题开发的有关文档！

# 修改主题配置文件

在主题文件夹下的 `_config.yml` （以下简称主题配置文件）合适位置中加入以下内容：

```yaml
comment: 
    use: true
    shortname: {YOUR_SHORTNAME}
    thread_key: {IDENTIFIER}
```

注意，这些评论系统的配置内容仅供参考。有的评论系统可能需要配置更多信息或者不需要配置某些信息（如友言需要配置 conf、appid 而不是 shortname），请自行根据需求进行修改。

> 如果你的修改只是给你一个人使用，这一步可以忽略。但是如果你想把你的成果分享出去或提交给上游，建议通过主题配置文件的方法配置这些属性，这样可以方便更多人使用。

# 添加评论 ejs

在主题内的合适位置新建一个 ejs 文件，命名如 `comment.ejs`，填入评论框的公共代码（即包括引用有关 js 文件等的代码）加上评论框的代码。

> 对于评论系统的公共代码，你也可以插入在其它位置。以 Material 主题为例，typecho-theme-material 的评论公共代码在侧边栏，hexo-theme-material 的评论公共代码在 footer。

然后，替换提供的代码中的有关变量。常见的变量有 shortname、page_identifier 等。这些变量可以通过 Hexo 的 API 进行调用。比如你可以使用 `<%= theme.comment.shortname %>` 这样的 API  即可调用你在主题配置文件中的 `comment.hortname` 属性中赋的值。

> 当然，正如我在上一步所说，如果你的修改只是供你一个人使用，你可以直接将你的变量值替换到这段代码中，而不需要额外通过主题配置文件进行调用。

# 在文章页面添加评论

在类似于 `post.ejs` 的文件中，在文章结尾处插入`<%- partial('/THE_PATH_TO/comment') %>` 来调用 `/YOUR PATH/comment.ejs` 文件。这样在 Hexo 生成静态页面时就会把评论部分插入进去。

# 实践
    
以上内容是 Hexo 主题加入评论系统的方法。现在介绍一下 [Material](https://material.viosey.com) 主题的评论系统是如何添加的。

Material 主题涉及到评论系统的组件有：

- post.ejs（文章页面，引用评论系统）
- layout/_partial/comment.ejs（评论框）
- layout/_partial/footer-option.ejs（评论系统公共代码）
- layout/_widget/disqus.ejs（Disqus 评论框组件）
- layout/_widget/duoshuo.ejs（多说评论框组件）

首先，我们在主题配置文件中，写入以下内容：

```yaml
# Comment Systems
# Available value of "use":
#     duoshuo | disqus
comment:
    use:
    shortname:
    duoshuo_thread_key_type: path
    duoshuo_embed_js_url: "https://static.duoshuo.com/embed.js"
```

> 这些用来定义评论系统在主题配置文件中的变量。

然后，在 `footer-options.ejs` 加入下述代码：

```html
<% if(theme.comment.use === 'duoshuo') { %>
    <!-- 多说公共 js 代码 start -->
    <script type="text/javascript">
        queue.offer(function(){
            var duoshuoQuery = {
                short_name: '<%= theme.comment.shortname %>'
            };
            (function() {
                var ds = document.createElement('script');
                ds.type = 'text/javascript';
                ds.async = true;
                ds.src = '<%= theme.comment.duoshuo_embed_js_url %>';
                ds.charset = 'UTF-8';
                (document.getElementsByTagName('head')[0]
                 || document.getElementsByTagName('body')[0]).appendChild(ds);
            })();
        });
    </script>
    <!-- 多说公共 js 代码 end -->
<% } %>

<% if(theme.comment.use === 'disqus') { %>
    <!-- 使用 DISQUS js 代码 -->
    <script id="dsq-count-scr" src="//<%= theme.comment.shortname %>.disqus.com/count.js" async></script>
<% } %>
```

> 这一段包括了一个判断，那就是通过判断用户在主题配置文件里配置的值来判断用户选择的评论系统，并选择加载哪一段代码。

接下来是创建 [`duoshuo.ejs`](https://github.com/viosey/hexo-theme-material/blob/master/layout/_widget/disqus.ejs) 和 [`disqus.ejs`](https://github.com/viosey/hexo-theme-material/blob/master/layout/_widget/duoshuo.ejs)。这个是评论框的组件。里面的一些变量换成了由 Hexo 的主题配置文件里的变量。

> 下面这个是 `duoshuo.ejs` 的内容。

```html
<%- css('css/duoshuo.min') %>
<style>
    #ds-thread #ds-reset .ds-post-button{
        background-color: <%= theme.uiux.theme_color %> !important;
    }
    #ds-wrapper #ds-reset .ds-icons-32{
        background-color: <%= theme.uiux.theme_color %> !important;
    }
    #ds-reset .ds-highlight {
        color: <%= theme.uiux.theme_color %> !important;
    }
</style>
<div id="comments">
    <!-- 多说评论框 start -->
    <div class="ds-thread"
        data-thread-key="<%= theme.comment.duoshuo_thread_key_type === 'id' ? page.id : page.path %>"
        data-url="<%- config.url + config.root + page.path %>"
        data-title="<%= page.title %>">
    </div>
    <!-- 多说评论框 end -->
</div>
```

> 下面这个是 `disqus.ejs` 的内容。

```html
<div id="disqus_thread"></div>
<script>
    queue.offer(function() {
            var disqus_config = function () {
                this.page.url = '<%- config.url + url_for(path) %>';  // Replace PAGE_URL with your page's canonical URL variable
                this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
            };
            (function() { // DON'T EDIT BELOW THIS LINE
                var d = document;
                var s = d.createElement('script');
                s.src = '//<%= theme.comment.shortname %>.disqus.com/embed.js';
                s.setAttribute('data-timestamp', + new Date());
                (d.head || d.body).appendChild(s);
            })();
        });
</script>
```

> 本文给了这两个文件在 Github 的链接。大家可以直接参考。

然后我们创建了 `comment.ejs`，根据用户的配置，判断加载哪一个评论框。

```html
<% if(theme.comment.use === 'duoshuo') { %>
    <!-- 使用多说评论 -->
    <%- partial('_widget/duoshuo') %>
<% } %>

<% if(theme.comment.use === 'disqus') { %>
    <!-- 使用 DISQUS -->
    <div id="disqus-comment">
        <%- partial('_widget/disqus') %>
    </div>
    <style>
        #disqus-comment{
            background-color: #eee;
            padding: 2pc;
        }
    </style>
<% } %>

<% if(theme.comment.use === 'disqus_click') { %>
    <!-- 使用 DISQUS_CLICK -->
    <div id="disqus-comment">	
        <%- partial('_widget/disqus_click') %>
    </div>
    <style>
        #disqus-comment{
            background-color: #eee;
            padding: 2pc;
        }
    </style>
<% } %>
```

最后就是在 `post.ejs` 里引用这个模块加载评论。

```ejs
<%- partial('_partial/comment') %>
```

> 在 Material 主题现有的框架基础上添加评论系统可以参考 Material 主题的 [Pull Request #247](https://github.com/viosey/hexo-theme-material/pull/247)，这是一位 Contributer 为 Material 主题添加了畅言评论系统的支持。

由于多说的关闭，Material 主题接下来也会去除对多说评论系统的支持。 大家可以根据本文的思路自己更换为新的评论系统。我们也欢迎大家把你的改动贡献到给 Material 主题，来 Open a new pull request 吧！
