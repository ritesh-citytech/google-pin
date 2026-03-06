<?php

declare(strict_types=1);

namespace Citytech\GooglePin\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Store\Model\ScopeInterface;

class Config extends AbstractHelper
{
    private const XML_PATH_ENABLED = 'citytech_googlepin/general/enabled';
    private const XML_PATH_API_KEY = 'citytech_googlepin/general/api_key';
    private const XML_PATH_DEFAULT_LAT = 'citytech_googlepin/general/default_lat';
    private const XML_PATH_DEFAULT_LNG = 'citytech_googlepin/general/default_lng';
    private const XML_PATH_DEFAULT_ZOOM = 'citytech_googlepin/general/default_zoom';

    public function isEnabled(): bool
    {
        return $this->scopeConfig->isSetFlag(self::XML_PATH_ENABLED, ScopeInterface::SCOPE_STORE);
    }

    public function getApiKey(): string
    {
        return (string) $this->scopeConfig->getValue(self::XML_PATH_API_KEY, ScopeInterface::SCOPE_STORE);
    }

    public function getDefaultLat(): float
    {
        return (float) $this->scopeConfig->getValue(self::XML_PATH_DEFAULT_LAT, ScopeInterface::SCOPE_STORE);
    }

    public function getDefaultLng(): float
    {
        return (float) $this->scopeConfig->getValue(self::XML_PATH_DEFAULT_LNG, ScopeInterface::SCOPE_STORE);
    }

    public function getDefaultZoom(): int
    {
        return max(1, (int) $this->scopeConfig->getValue(self::XML_PATH_DEFAULT_ZOOM, ScopeInterface::SCOPE_STORE));
    }
}
