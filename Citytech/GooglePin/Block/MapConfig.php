<?php

declare(strict_types=1);

namespace Citytech\GooglePin\Block;

use Citytech\GooglePin\Helper\Config as ModuleConfig;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template;

class MapConfig extends Template
{
    public function __construct(
        Template\Context $context,
        private readonly ModuleConfig $config,
        private readonly Json $json,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    public function isEnabled(): bool
    {
        return $this->config->isEnabled() && $this->config->getApiKey() !== '';
    }

    public function getApiKey(): string
    {
        return $this->config->getApiKey();
    }

    public function getConfigJson(): string
    {
        return $this->json->serialize([
            'apiKey' => $this->config->getApiKey(),
            'defaultLat' => $this->config->getDefaultLat(),
            'defaultLng' => $this->config->getDefaultLng(),
            'defaultZoom' => $this->config->getDefaultZoom(),
        ]);
    }
}
