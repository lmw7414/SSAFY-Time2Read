package org.ssafy.bibibig.result.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.bibibig.articles.application.ArticleService;
import org.ssafy.bibibig.articles.domain.ArticleEntity;
import org.ssafy.bibibig.articles.dto.Article;
import org.ssafy.bibibig.result.dao.ElasticsearchRelatedArticleRepository;
import org.ssafy.bibibig.result.dto.response.RelatedArticleResponse;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ResultService {

    private final ArticleService articleService;
    private final ElasticsearchRelatedArticleRepository relatedArticleRepository;

    public List<RelatedArticleResponse> getRelatedArticles(List<String> id) {
        return id
                .stream()
                .map(articleService::findById)
                .map(article -> new RelatedArticleResponse(article.id(), articleToRelateArticle(article)))
                .toList();
    }

    private List<Article> articleToRelateArticle(Article article) {
        List<ArticleEntity> relatedArticles = relatedArticleRepository.getRelatedArticles(
                article.mainCategory(),
                article.wroteAt().getYear() + 1,
                2024,
                article.keywords(),
                1);

        return relatedArticles.stream()
                .map(Article::from)
                .toList();
    }
}
